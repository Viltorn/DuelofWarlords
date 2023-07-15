/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';

const initialState = {
  playerOneDeck: [],
  playerTowDeck: [],
  activeCard: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    addActiveCard(state, { payload }) {
      const newState = { ...payload, status: 'active' };
      state.activeCard = newState;
    },
    deleteActiveCard(state) {
      state.activeCard = null;
    },
    addChat(state, { payload }) {
      const newChat = payload;
      if (newChat.name === '') {
        newChat.name = _.uniqueId('User_');
      }
      state.currentChats = [...state.currentChats, newChat];
    },
    addAvatar(state, { payload }) {
      const { id, avatarUrl } = payload;
      const newChats = state.currentChats.map((chat) => {
        if (chat.id === id) {
          chat.avatar = avatarUrl;
        }
        return chat;
      });
      state.currentChats = [...newChats];
    },
    changeName(state, { payload }) {
      const { id, chatName } = payload;
      const newChats = state.currentChats.map((chat) => {
        if (chat.id === id) {
          chat.name = chatName;
        }
        return chat;
      });
      state.currentChats = [...newChats];
    },
    changeCurrentChat(state, { payload }) {
      const id = payload;
      state.currentChatId = id;
      state.currentChats = state.currentChats.map((chat) => {
        if (chat.id === id) {
          chat.read = 'yes';
        }
        return chat;
      });
    },
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
