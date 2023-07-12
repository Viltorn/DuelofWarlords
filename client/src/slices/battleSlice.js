/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import _ from 'lodash';
import { actions as messagesActions } from './messagesSlice.js';

const initialState = {
  currentChats: [],
  archiveChats: [],
  currentChatId: '',
};

const battleSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addChats(state, { payload }) {
      const newChats = payload.map((chat) => {
        if (chat.name === '') {
          chat.name = _.uniqueId('User_');
        }
        return chat;
      });
      state.currentChats = [...newChats];
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
  extraReducers: (builder) => {
    builder
      .addCase(messagesActions.addMessage, (state, { payload }) => {
        const { chatId, senderName } = payload;
        const name = senderName !== '' ? senderName : _.uniqueId('User_');
        const oldChat = state.currentChats.find((chat) => chat.id === chatId);
        if (!oldChat) {
          state.currentChats = [{
            id: chatId,
            name,
            type: 'user',
            read: 'not',
          }, ...state.currentChats];
        }
        if (oldChat && state.currentChatId !== chatId) {
          const restChats = state.currentChats.filter((chat) => chat.id !== chatId);
          oldChat.read = 'not';
          state.currentChats = [oldChat, ...restChats];
        }
      });
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
