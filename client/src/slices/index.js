import { configureStore } from '@reduxjs/toolkit';
import battleReducer from './battleSlice.js';

export default configureStore({
  reducer: {
    battleReducer,
  },
});
