/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {
    addMessages(state, { payload }) {
      state.messages = payload;
    },
    addMessage(state, { payload }) {
      state.messages = [...state.messages, payload];
    },
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(chatsActions.removeChannel, (state, { payload }) => {
  //       const { id } = payload;
  //       state.messages = state.messages.filter((message) => message.channelId !== id);
  //     });
  // },
});

export const { actions } = messagesSlice;
export default messagesSlice.reducer;
