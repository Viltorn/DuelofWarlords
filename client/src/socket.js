import { io } from 'socket.io-client'; // import connection function

const socket = io('localhost:8080'); // https://duelofwarlords.ru'); // initialize websocket connection

export default socket;
