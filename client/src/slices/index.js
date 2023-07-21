import { configureStore } from '@reduxjs/toolkit';
import battleReducer from './battleSlice.js';
import modalsReducer from './modalsSlice.js';

export default configureStore({
  reducer: {
    battleReducer,
    modalsReducer,
  },
});
