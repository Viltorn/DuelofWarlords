import { configureStore } from '@reduxjs/toolkit';
import messagesReducer from './messagesSlice.js';
import modalsReducer from './modalsSlice.js';
import chatsReducer from './chatsSlice.js';

export default configureStore({
  reducer: {
    chatsReducer,
    messagesReducer,
    modalsReducer,
  },
});
