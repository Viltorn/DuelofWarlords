import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { Server } from "socket.io";
import { v4 as uuidV4 } from 'uuid';
import { createServer } from 'http';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express(); // initialize express

const server = createServer(app);

// set port to value received from environment variable or 8080 if null
const port = process.env.PORT || 80

app.use(express.static(path.join(__dirname, "../client/build")));

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

// io.connection
io.on('connection', (socket) => {
  // socket refers to the client socket that just got connected.
  // each socket is assigned an id
  console.log(socket.id, 'connected');

  const currentRooms = Array.from(rooms.values()); // <- 1

  currentRooms.forEach((room) => { // <- 2
    const roomUser = room.players.find((player) => player.id === socket.id); // <- 3

    if (roomUser) {
      io.to(room.roomId).emit('playerReconnected', userInRoom); // <- 4
    }
  });

  socket.on('username', (args, callback) => {
    console.log('username:', args.username);
    socket.data.username = args.username;
    const gameRooms = Array.from(rooms.values());
    console.log(gameRooms);
    const count = io.engine.clientsCount;
    io.emit('clientsCount', count);
    callback(gameRooms);
  });

  socket.on('createRoom', async (args, callback) => { // callback here refers to the callback function from the client passed as data
    const roomId = uuidV4(); // <- 1 create a new uuid
    const { hero,  deck, hand  } = args
    await socket.join(roomId); // <- 2 make creating user join the room
   
    // set roomId as a key and roomData including players as value in the map
    rooms.set(roomId, { // <- 3
      roomId,
      players: [{ id: socket.id, type: 'player1', username: socket.data?.username, hero, deck, hand }],
    });

    const gameRooms = Array.from(rooms.values());

    callback(roomId); // <- 4 respond with roomId to client by calling the callback function from the client
    io.emit('rooms', gameRooms);
  });

  socket.on('joinRoom', async (args, callback) => {
    // check if room exists and has a player waiting
    const { hero, deck, hand, room  } = args;
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
    }

    if (error) {
      // if there's an error, check if the client passed a callback,
      // call the callback (if it exists) with an error object and exit or 
      // just exit if the callback is not given

      // if user passed a callback, call it with an error payload
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
    // respond to the client with the room details.
    // emit an 'opponentJoined' event to the room to tell the other player that an opponent has joined
    socket.to(room).emit('opponentJoined', roomUpdate);
    const gameRooms = Array.from(rooms.values());
    io.emit('rooms', gameRooms);
    callback(roomUpdate);
  });

  socket.on('disconnect', () => {
    const gameRooms = Array.from(rooms.values()); // <- 1

    gameRooms.forEach((room) => { // <- 2
      const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3
      const allRoomUsers = io.in(room.roomId).engine.clientsCount;

      if (userInRoom) {
        if (room.players.length < 2 || allRoomUsers === 0) {
          // if there's only 1 player in the room, close it and exit.
          rooms.delete(room.roomId);
          return;
        }
        socket.to(room.roomId).emit('playerDisconnected', userInRoom); // <- 4
      }
    });
    const newGameRooms = Array.from(rooms.values());
    io.emit('rooms', newGameRooms);
    const count = io.engine.clientsCount;
    io.emit('clientsCount', count);
  });

  socket.on('makeMove', (data, callback) => {
    socket.to(data.room).emit('makeMove', data);
    console.log('move');
    callback();
  });

  socket.on('closeRoom', async (data, callback) => {
    const { roomId } = data;
    console.log(rooms.get(roomId));
    if (rooms.get(roomId)) {
      console.log('closing room');
      socket.to(roomId).emit('closeRoom', data);
      const clientSockets = await io.in(roomId).fetchSockets(); // <- 2 get all sockets in a room

      // loop over each socket client
      clientSockets.forEach((s) => {
        s.leave(roomId); // <- 3 and make them leave the room on socket.io
      });

      rooms.delete(roomId); // <- 4 delete room from rooms map
      const gameRooms = Array.from(rooms.values());
      
      io.emit('rooms', gameRooms);
      if (callback) {
        callback(gameRooms);
      }
    }
  });

});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});