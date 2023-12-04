import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameMode: '',
  rooms: [],
  curRoom: '',
  name: '',
  onlineCount: '',
  socketId: '',
  messages: [],
  logged: false,
  userType: '',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    resetState(state) {
      state.gameMode = '';
      state.curRoom = '';
    },

    resetConnection(state) {
      state.name = '';
      state.rooms = [];
    },

    setSocketId(state, { payload }) {
      const { socketId } = payload;
      state.socketId = socketId;
    },

    setGameMode(state, { payload }) {
      const { gameMode } = payload;
      state.gameMode = gameMode;
    },

    setPlayerName(state, { payload }) {
      const { name } = payload;
      state.name = name;
    },

    setCurrentRoom(state, { payload }) {
      const { room } = payload;
      state.curRoom = room;
    },

    updateRooms(state, { payload }) {
      const { rooms } = payload;
      state.rooms = rooms;
    },

    setOnlineCount(state, { payload }) {
      const { count } = payload;
      state.onlineCount = count;
    },

    addMessage(state, { payload }) {
      const { data } = payload;
      state.messages = [...state.messages, data];
    },
    setMessages(state, { payload }) {
      const { data } = payload;
      state.messages = [...data];
    },
    setLogged(state, { payload }) {
      const { logged } = payload;
      state.logged = logged;
    },
    setUserType(state, { payload }) {
      const { userType } = payload;
      state.userType = userType;
    },
  },
});

export const { actions } = gameSlice;
export default gameSlice.reducer;
