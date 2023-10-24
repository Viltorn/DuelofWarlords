import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameMode: '',
  rooms: [],
  curRoom: '',
  name: '',
  onlineCount: '',
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
  },
});

export const { actions } = gameSlice;
export default gameSlice.reducer;
