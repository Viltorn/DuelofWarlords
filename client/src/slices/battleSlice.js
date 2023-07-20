/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import academiaDeck from '../game-data/academiaDeck.js';
import makeFieldCells from '../utils/makeFieldCells.js';
import makeShaffledDeck from '../utils/makeShaffledDeck.js';
import { bigSpell, topSpells, midSpells } from '../game-data/spellCellsData.js';

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
  spellCells: [...bigSpell, ...topSpells, ...midSpells],
  activeCard: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    addActiveCard(state, { payload }) {
      const { card, player } = payload;
      const newState = { ...card, player };
      state.activeCard = newState;
    },
    deleteActiveCard(state) {
      state.activeCard = null;
    },
    addFieldContent(state, { payload }) {
      const { activeCard, id } = payload;
      const changedActiveCard = { ...activeCard, status: 'field', cellId: id };
      const newFieldCells = state.fieldCells.map((cell) => {
        if (cell.id === id) {
          cell.content = [changedActiveCard, ...cell.content];
        }
        return cell;
      });
      state.fieldCells = [...newFieldCells];
      const hand = activeCard.player === 'player1' ? 'playerOneHand' : 'playerTwoHand';
      const newPlayerHand = state[hand].filter((card) => card.id !== activeCard.id);
      state[hand] = newPlayerHand;
    },
    deleteFieldCard(state, { payload }) {
      const { cardId, cellId } = payload;
      const newState = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          cell.content = cell.content.filter((item) => item.id !== cardId);
        }
        return cell;
      });
      state.fieldCells = newState;
    },
    deleteHandCard(state, { payload }) {
      const { player, cardId } = payload;
      const hand = player === 'player1' ? 'playerOneHand' : 'playerTwoHand';
      state[hand] = state[hand].filter((card) => card.id !== cardId);
    },
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
