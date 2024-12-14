import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bigCard: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    resetState(state) {
      state.bigCard = null;
    },

    setBigCard(state, { payload }) {
      const card = payload;
      state.bigCard = card;
    },
  },
});

export const { actions } = uiSlice;
export default uiSlice.reducer;
