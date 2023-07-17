/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import academiaDeck from '../game-data/academiaDeck.js';
import makeFieldCells from '../utils/makeFieldCells.js';
import makeShaffledDeck from '../utils/makeShaffledDeck.js';

const cellsData = {
  rows: ['1', '2', '3', '4'],
  linesSideOne: ['1', '2'],
  linesSideTwo: ['3', '4'],
};

const initialState = {
  playerOneDeck: [],
  playerOneHand: makeShaffledDeck(academiaDeck),
  playerTwoHand: [],
  playerTwoDeck: [],
  fieldCells: makeFieldCells(cellsData),
  activeCard: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    addActiveCard(state, { payload }) {
      const { card, player } = payload;
      const newState = { ...card, status: 'active', player };
      state.activeCard = newState;
    },
    deleteActiveCard(state) {
      state.activeCard = null;
    },
    addFieldContent(state, { payload }) {
      const { activeCard, id } = payload;
      const newFieldCells = state.fieldCells.map((cell) => {
        if (cell.id === id) {
          cell.content = [...cell.content, activeCard];
        }
        return cell;
      });
      state.fieldCells = newFieldCells;
      state.activeCard = null;
      const hand = activeCard.player === 'player1' ? 'playerOneHand' : 'playerTwoHand';
      const newPlayerHand = state[hand].filter((card) => card.id !== activeCard.id);
      state[hand] = newPlayerHand;
    },
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
