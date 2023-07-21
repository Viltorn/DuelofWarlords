/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import academiaDeck from '../game-data/academiaDeck.js';
import createFieldCells from '../utils/makeFieldCells.js';
import makeShaffledDeck from '../utils/makeShaffledDeck.js';
import createDeckForPLayer from '../utils/makeDeckForPlayer.js';
import { bigSpell, topSpells, midSpells } from '../game-data/spellCellsData.js';

const cellsData = {
  rows: ['1', '2', '3', '4'],
  linesSideOne: ['1', '2'],
  linesSideTwo: ['3', '4'],
};

const initialState = {
  commonPoints: 1,
  player1Points: 1,
  player2Points: 1,
  player: 'player1',
  playerOneDeck: [],
  playerOneHand: createDeckForPLayer(makeShaffledDeck(academiaDeck), 'player1'),
  playerTwoHand: [],
  playerTwoDeck: [],
  fieldCells: [...createFieldCells(cellsData), ...bigSpell, ...topSpells, ...midSpells],
  activeCard: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    addActiveCard(state, { payload }) {
      const { card } = payload;
      state.activeCard = card;
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

    returnCard(state, { payload }) {
      const { card } = payload;
      const changedCard = { ...card, status: 'hand', cellId: '' };
      const hand = changedCard.player === 'player1' ? 'playerOneHand' : 'playerTwoHand';
      state[hand] = [...state[hand], changedCard];
    },

    turnCardLeft(state, { payload }) {
      const { cardId, cellId } = payload;
      const newState = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          cell.content = cell.content.map((card) => {
            if (card.id === cardId) {
              card.turn += 1;
            }
            return card;
          });
        }
        return cell;
      });
      state.fieldCells = newState;
    },

    turnCardRight(state, { payload }) {
      const { cardId, cellId } = payload;
      const newState = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          cell.content = cell.content.map((card) => {
            if (card.id === cardId) {
              card.turn -= 1;
            }
            return card;
          });
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

    changeHP(state, { payload }) {
      const { health, cardId, cellId } = payload;
      const newState = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          cell.content = cell.content.map((card) => {
            if (card.id === cardId) {
              card.currentHP = health;
            }
            return card;
          });
        }
        return cell;
      });
      state.fieldCells = newState;
    },
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
