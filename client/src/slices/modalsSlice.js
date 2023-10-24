/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpened: false,
  type: null,
  id: null,
  cellId: null,
  roomId: null,
  player: null,
  name: null,
  dest: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal(state, { payload }) {
      state.isOpened = true;
      state.type = payload.type;
      state.roomId = payload.roomId ?? null;
      state.id = payload.id ?? null;
      state.cellId = payload.cellId ?? null;
      state.player = payload.player ?? null;
      state.name = payload.name ?? null;
      state.dest = payload.dest ?? null;
    },
    closeModal(state) {
      state.isOpened = false;
      state.type = null;
      state.roomId = null;
      state.id = null;
      state.cellId = null;
      state.player = null;
      state.name = null;
      state.dest = null;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
