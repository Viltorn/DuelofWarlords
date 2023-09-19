import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  gameMode: '',
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    setGameMode(state, { payload }) {
      const { gameMode } = payload;
      state.gameMode = gameMode;
    },
  },
});

export const { actions } = gameSlice;
export default gameSlice.reducer;
