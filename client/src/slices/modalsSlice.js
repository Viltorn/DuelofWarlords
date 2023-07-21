/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isOpened: false,
  type: null,
  id: null,
  cellId: null,
};

const modalsSlice = createSlice({
  name: 'modals',
  initialState,
  reducers: {
    openModal(state, { payload }) {
      state.isOpened = true;
      state.type = payload.type;
      state.id = payload.id ?? null;
      state.cellId = payload.cellId ?? null;
    },
    closeModal(state) {
      state.isOpened = false;
      state.type = null;
      state.id = null;
      state.cellId = null;
    },
  },
});

export const { actions } = modalsSlice;
export default modalsSlice.reducer;
