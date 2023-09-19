import { configureStore } from '@reduxjs/toolkit';
import battleReducer from './battleSlice.js';
import gameReducer from './gameSlice.js';
import modalsReducer from './modalsSlice.js';

export default configureStore({
  reducer: {
    gameReducer,
    battleReducer,
    modalsReducer,
  },
});
