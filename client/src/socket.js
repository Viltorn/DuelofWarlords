import { io } from 'socket.io-client'; // import connection function

const socket = io('https://duelsofwarlords.onrender.com:8080'); // initialize websocket connection

export default socket;
