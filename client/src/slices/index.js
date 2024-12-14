import { configureStore } from '@reduxjs/toolkit';
import battleReducer from './battleSlice.js';
import gameReducer from './gameSlice.js';
import modalsReducer from './modalsSlice.js';
import deckbuilderReducer from './deckbuilderSlice.js';
import uiReducer from './uiSlice.js';

export default configureStore({
  reducer: {
    deckbuilderReducer,
    gameReducer,
    battleReducer,
    modalsReducer,
    uiReducer,
  },
});
