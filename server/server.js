import express from 'express';
import { createClient } from 'redis';
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

const redisClient = async () => {
  const client = createClient({
      url: process.env.REDIS_URL
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  // Send and retrieve some values
  console.log('redis connected');
  // const rawRes = await client.get(key, function(err, result) {
  //   if (err) {
  //     console.log('DatabaseError');
  //   } else if (result === null) {
  //     console.log('UserDoesNotExist');
  //   } else {
  //     console.log(result);
  //   }
  // });
  return client;
};

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
  // socket refers to the client socket that just got connected.
  // each socket is assigned an id
  const isRoomEmpty = (roomid) => {
    const room = io.sockets.adapter.rooms.get(roomid);
    return room ? room.size === 0 : true;
  };

  const isRoomFull = (roomId) => {
    const room = io.sockets.adapter.rooms.get(roomId);
    return room.size === 2;
  }

  const getRooms = () => Array.from(rooms.values());

  console.log(socket.id, 'connected');

  const currentRooms = getRooms(); // <- 1

  currentRooms.forEach(async (room) => { // <- 2
    const roomUser = room.players.find((player) => player.id === socket.id); // <- 3

    if (roomUser) {
      await socket.join(room.roomId);
      io.to(room.roomId).emit('playerReconnected', roomUser);
    }
  });

  const userCount = io.engine.clientsCount;
  io.emit('clientsCount', userCount);
  io.to(socket.id).emit('getSocketId', socket.id);

  // socket.on('username', (args, callback) => {
  //   console.log('username:', args.username);
  //   socket.data.username = args.username;
  //   console.log(getRooms());
  //   const count = io.engine.clientsCount;
  //   io.emit('clientsCount', count); 
  //   io.to(socket.id).emit('getMessages', messages);
  //   callback(socket.id, getRooms());
  // });

  const redis = await redisClient();

  socket.on('logIn', async (data, callback) => {
    try {
      const { username, password } = data;
      console.log('log1');
      const rawRes = await redis.get(username, function(err, result) {
          if (err) {
            console.log('DatabaseError');
          } else if (result === null) {
            console.log('UserDoesNotExist');
          } else {
            console.log(result);
          }
        });
      
      if (rawRes === null) {
        callback({error: true, message: 'UserDoesNotExist'});
        return;
      }

      const res = JSON.parse(rawRes);
      const { pass } = res;
        
      if (pass !== password) {
        const error = true;
        const message = 'WrongPass';
        callback({ error, message });
        return;
      }

      socket.data.username = username;
      console.log(getRooms());
      const count = io.engine.clientsCount;
      io.emit('clientsCount', count); 
      io.to(socket.id).emit('getMessages', messages);
      callback({ id: socket.id, rooms: getRooms()});
    } catch (e) {
      return;
    }
  });

  socket.on('signUp', async (args, callback) => {
    const { username, password } = args;
    const rawRes = await redis.get(username, function(err, result) {
      if (err) {
        console.log('DatabaseError');
      } else if (result !== null) {
        console.log('UserAlreadyExist');
      }
    });

    if (rawRes !== null) {
      callback({error: true, message:  'UserAlreadyExist' });
      return;
    }
    
    const jsonData = JSON.stringify({ pass: password });
    await redis.set(username, jsonData);
  
    socket.data.username = username;
    console.log(getRooms());
    const count = io.engine.clientsCount;
    io.emit('clientsCount', count); 
    io.to(socket.id).emit('getMessages', messages);
    callback({ id: socket.id, rooms: getRooms()});
  });

  socket.on('createRoom', async (args, callback) => { // callback here refers to the callback function from the client passed as data
    const roomId = uuidV4(); // <- 1 create a new uuid
    const { hero,  deck, hand, password  } = args
    await socket.join(roomId); // <- 2 make creating user join the room
   
    // set roomId as a key and roomData including players as value in the map
    rooms.set(roomId, { // <- 3
      roomId,
      players: [{ id: socket.id, type: 'player1', username: socket.data?.username, hero, deck, hand }],
      password
    });

    callback(roomId); // <- 4 respond with roomId to client by calling the callback function from the client
    io.emit('rooms', getRooms());
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
    io.emit('rooms', getRooms());
    callback(roomUpdate);
  });

  socket.on('disconnect', () => {
    const gameRooms = getRooms(); // <- 1

    gameRooms.forEach((room) => { // <- 2
      const userInRoom = room.players.find((player) => player.id === socket.id); // <- 3

      if (userInRoom) {
        if (room.players.length < 2 || isRoomEmpty(room.roomId)) {
          // if there's only 1 player in the room, close it and exit.
          rooms.delete(room.roomId);
          return;
        }
        socket.leave(room.roomId);
        socket.to(room.roomId).emit('playerDisconnected', userInRoom); // <- 4
      }
    });
    io.emit('rooms', getRooms());
    const count = io.engine.clientsCount;
    io.emit('clientsCount', count);
  });

  socket.on('makeMove', (data, callback) => {
    const { room, move } = data;
    if (isRoomFull(room)) {
      socket.to(room).emit('makeMove', data);
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
      const clientSockets = await io.in(roomId).fetchSockets(); // <- 2 get all sockets in a room

      // loop over each socket client
      clientSockets.forEach((s) => {
        s.leave(roomId); // <- 3 and make them leave the room on socket.io
      });

      rooms.delete(roomId); // <- 4 delete room from rooms map
      
      io.emit('rooms', getRooms());
      if (callback) {
        callback(getRooms());
      }
    }
  });

  socket.on('message', (data) => {
    const { name, message } = data;
    const id = uuidV4();
    const newData = { senderName: name, body: message, id }
    if (messages.length >= 50) {
      messages.shift();
    }
    messages.push(newData);
    io.emit('message', newData);
  })

});

server.listen(port, () => {
  console.log(`listening on *:${port}`);
});