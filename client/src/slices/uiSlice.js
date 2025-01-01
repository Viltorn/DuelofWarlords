import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bigCard: null,
  timer: null,
  isTimerOver: false,
  isTimerPaused: false,
  curTime: [0, 0],
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    resetState: () => initialState,

    setBigCard(state, { payload }) {
      const card = payload;
      state.bigCard = card;
    },

    setTimer(state, { payload }) {
      const timer = payload;
      state.timer = timer;
    },

    setTimerIsOver(state, { payload }) {
      const isOver = payload;
      state.isTimerOver = isOver;
    },

    setTimerIsPaused(state, { payload }) {
      const isPaused = payload;
      state.isTimerPaused = isPaused;
    },

    setCurTime(state, { payload }) {
      state.curTime = payload;
    },
  },
});

export const { actions } = uiSlice;
export default uiSlice.reducer;
