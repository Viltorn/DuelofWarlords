import { io } from 'socket.io-client'; // import connection function

const socket = io('https://duelsofwarlords.onrender.com'); // initialize websocket connection

export default socket;
