import { io } from 'socket.io-client'; // import connection function

const socket = io('https://duelofwarlords.ru'); // initialize websocket connection

export default socket;
