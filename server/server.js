import express from 'express';
import path from 'path';
import redis from './redisInit.js'
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import { v4 as uuidV4 } from 'uuid';
import { createServer } from 'http';
import cors from 'cors';
import authRouter from './routes/auth.js'
import accountsRouter from './routes/accounts.js'
import isRoomEmpty from './utils/isRoomEmpty.js';
import isRoomFull from './utils/isRoomFull.js';
import getRooms from './utils/getRooms.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);

const port = process.env.PORT || 80

app.use(express.static(path.join(__dirname, "../client/build")));
app.use(cors()); // allow connection from any origin
app.use(express.json());
app.use('/auth', authRouter);
app.use('/accounts', accountsRouter);

app.get("/", function(req, res) {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

// upgrade http server to websocket server
const io = new Server(server, {
  cors: '*', // allow connection from any origin
  connectionStateRecovery: {
    // the backup duration of the sessions and the packets
    maxDisconnectionDuration: 2 * 60 * 1000,
    // whether to skip middlewares upon successful recovery
    skipMiddlewares: true,
  }
});

const rooms = new Map();
const messages = [];

// io.connection

io.on('connection', async (socket) => {

  console.log(socket.id, 'connected');

  const currentRooms = getRooms(rooms);

  currentRooms.forEach(async (room) => {
    const roomUser = room.players.find((player) => player.id === socket.id);

    if (roomUser) {
      console.log('room user name:')
      console.log(roomUser.username);
      await socket.join(room.roomId);
      io.to(room.roomId).emit('playerReconnected', roomUser);
    }
  });

  socket.emit('getSocketId', socket.id);

  socket.on('updateOnlineData', async (data, callback) => {
    const { username } = data;
    socket.data.username = username;
    const userCount = io.engine.clientsCount;
    socket.broadcast.emit('clientsCount', userCount); 
    // io.to(socket.id).emit('getMessages', messages);
    callback({ id: socket.id, newRooms: getRooms(rooms), messages, players: userCount });
  });

  socket.on('createRoom', async (args, callback) => { // callback here refers to the callback function from the client passed as data
    const roomId = uuidV4(); // <- 1 create a new uuid
    const { hero,  deck, hand, password, timer, messages  } = args
    await socket.join(roomId); // <- 2 make creating user join the room
   
    // set roomId as a key and roomData including players as value in the map
    rooms.set(roomId, { // <- 3
      roomId,
      players: [{ id: socket.id, type: 'player1', username: socket.data?.username, hero, deck, hand }],
      password,
      timer,
      messages
    });

    callback(roomId); // <- 4 respond with roomId to client by calling the callback function from the client
    io.emit('rooms', getRooms(rooms));
  });

  socket.on('joinRoom', async (args, callback) => {
    // check if room exists and has a player waiting
    const { hero, deck, hand, room, password  } = args;
    const currentRoom = rooms.get(room);

    let error, message;
  
    if (!currentRoom) { // if room does not exist
      error = true;
      message = 'RoomNotExist';
    } else if (currentRoom.players.length <= 0) { // if room is empty set appropriate message
      error = true;
      message = 'RoomEmpty';
    } else if (currentRoom.players.length >= 2) { // if room is full
      error = true;
      message = 'RoomFull'; // set message to 'room is full'
    } else if (currentRoom.password !== password) {
      error = true;
      message = 'IncorrectPass';
    }

    if (error) {
      // if there's an error, check if the client passed a callback,
        callback({
          error,
          message
        });

      return; // exit
    }

    await socket.join(room); // make the joining client join the room

    // add the joining user's data to the list of players in the room
    const roomUpdate = {
      ...currentRoom,
      players: [
        ...currentRoom.players,
        { id: socket.id, type: 'player2', username: socket.data?.username, hero, deck, hand },
      ],
    };

    console.log(roomUpdate);

    rooms.set(room, roomUpdate);
    socket.to(room).emit('opponentJoined', roomUpdate);
    io.emit('rooms', getRooms(rooms));
    callback(roomUpdate);
  });

  socket.on('disconnect', () => {
    const gameRooms = getRooms(rooms);

    gameRooms.forEach((room) => {
      const userInRoom = room.players.find((player) => player.id === socket.id);

      if (userInRoom) {
        if (room.players.length < 2 || isRoomEmpty(room.roomId, io)) {
          // if there's only 1 player in the room, close it and exit.
          rooms.delete(room.roomId);
          return;
        }
        socket.leave(room.roomId);
        socket.to(room.roomId).emit('playerDisconnected', userInRoom);
      }
    });
    io.emit('rooms', getRooms(rooms));
    const userCount = io.engine.clientsCount;
    io.emit('clientsCount', userCount);
  });

  socket.on('makeMove', (data, callback) => {
    const { room } = data;
    if (isRoomFull(room, io)) {
      socket.to(room).emit('makeMove', data);
      callback({ error: false });
    } else {
      callback({ error: true });
    }
  });


  socket.on('messageRoom', (data, callback) => {
    const { room, name, message, player } = data;
    if (isRoomFull(room, io)) {
      const id = uuidV4();
      const newData = { senderName: name, body: message, id, player }
      console.log(newData);
      io.to(room).emit('messageRoom', newData);
      callback({ error: false });
    } else {
      callback({ error: true });
    }
  });

  socket.on('closeRoom', async (data, callback) => {
    const { roomId } = data;
    if (rooms.get(roomId)) {
      console.log('closing room');
      socket.to(roomId).emit('closeRoom', data);
      const clientSockets = await io.in(roomId).fetchSockets();

      // loop over each socket client
      clientSockets.forEach((s) => {
        s.leave(roomId);
      });

      rooms.delete(roomId);
      
      io.emit('rooms', getRooms(rooms));
      if (callback) {
        callback(getRooms(rooms));
      }
    }
  });

  socket.on('message', (data, callback) => {
    const { name, message } = data;
    const id = uuidV4();
    const newData = { senderName: name, body: message, id }
    if (messages.length >= 50) {
      messages.shift();
    }
    messages.push(newData);
    io.emit('message', newData);
    callback();
  })

});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});