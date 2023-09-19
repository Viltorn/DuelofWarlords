/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import createFieldCells from '../utils/makeFieldCells.js';
import {
  bigSpell, topSpells, midSpells, heroes, postponed, graveyard, fieldCells,
} from '../gameData/heroes&spellsCellsData.js';

const initialState = {
  commonPoints: 0,
  playerPoints: [{ player: 'player1', points: 1 }, { player: 'player2', points: 1 }],
  players: { player1: { name: 'Viktor', id: 'player1', cardsdrawn: false }, player2: { name: 'AI', id: 'player2', cardsdrawn: false } },
  thisPlayer: 'player1',
  playerOneDeck: [],
  playerOneHand: [],
  playerTwoHand: [],
  playerTwoDeck: [],
  fieldCells: [
    ...createFieldCells(fieldCells),
    ...bigSpell,
    ...topSpells,
    ...midSpells,
    ...heroes,
    ...postponed,
    ...graveyard,
  ],
  activeCardPlayer1: null,
  activeCardPlayer2: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    resetState: () => initialState,

    addAttachment(state, { payload }) {
      const { cellId, feature, type } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          if (type === 'cell' && cell.attachments) {
            cell.attachments = [...cell.attachments, feature];
          } else {
            cell.content.map((item) => {
              if (item.type === 'warrior' || item.type === 'hero') {
                item.attachments = [...item.attachments, feature];
              }
              return item;
            });
          }
        }
        return cell;
      });
    },

    deleteAttachment(state, { payload }) {
      const { spellId } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (cell.attachments) {
          cell.attachments = cell.attachments.filter((attach) => attach.id !== spellId);
        }
        if ((cell.type === 'field' || cell.type === 'hero') && cell.content.length !== 0) {
          cell.content.map((item) => {
            if (item.type === 'warrior' || item.type === 'hero') {
              item.attachments = item.attachments.filter((attach) => attach.id !== spellId);
            }
            return item;
          });
        }
        return cell;
      });
    },

    addAnimation(state, { payload }) {
      const { cell, type } = payload;
      state.fieldCells = state.fieldCells.map((cellItem) => {
        if (cellItem.id === cell?.id) {
          cellItem.animation = type;
        }
        return cellItem;
      });
    },

    deleteAnimation(state) {
      state.fieldCells = state.fieldCells.map((cellItem) => {
        cellItem.animation = '';
        return cellItem;
      });
    },

    setCardDrawStatus(state, { payload }) {
      const { player, status } = payload;
      state.players[player].cardsdrawn = status;
    },

    turnPostponed(state, { payload }) {
      const { player, status } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (cell.type === 'postponed' && cell.player === player) {
          cell.status = status === 'face' && cell.content.length !== 0 ? 'face' : 'cover';
        }
        return cell;
      });
    },

    massTurnCards(state, { payload }) {
      const { player } = payload;
      const changedCells = state.fieldCells
        .map((cell) => {
          if (cell?.player === player && (cell.type === 'hero' || cell.type === 'field')) {
            cell.content.map((item) => {
              if (item.type === 'warrior' || item.type === 'hero') {
                item.turn = item.turn > 0 ? item.turn - 1 : item.turn;
              }
              return item;
            });
          }
          return cell;
        });
      state.fieldCells = [...changedCells];
    },

    setHeroes(state, { payload }) {
      const { player1Hero, player2Hero } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (cell.id === 'hero1') {
          cell.content = [{ ...player1Hero, cellId: 'hero1', player: 'player1' }];
        }
        if (cell.id === 'hero2') {
          cell.content = [{ ...player2Hero, cellId: 'hero2', player: 'player2' }];
        }
        return cell;
      });
    },

    setPlayersDecks(state, { payload }) {
      const { player1Deck, player2Deck } = payload;
      state.playerOneDeck = player1Deck;
      state.playerTwoDeck = player2Deck;
    },

    setPlayersHands(state, { payload }) {
      const { player1Hand, player2Hand } = payload;
      state.playerOneHand = player1Hand;
      state.playerTwoHand = player2Hand;
    },

    drawCard(state, { payload }) {
      const { player } = payload;
      const hand = player === 'player1' ? 'playerOneHand' : 'playerTwoHand';
      const deck = player === 'player1' ? 'playerOneDeck' : 'playerTwoDeck';
      if (state[deck].length !== 0) {
        const card = state[deck].shift();
        state[hand] = [card, ...state[hand]];
      }
    },

    sendCardtoDeck(state, { payload }) {
      const { activeCard } = payload;
      const deck = activeCard.player === 'player1' ? 'playerOneDeck' : 'playerTwoDeck';
      state[deck] = [...state[deck], activeCard];
    },

    changePlayer(state, { payload }) {
      const { newPlayer } = payload;
      state.thisPlayer = newPlayer;
    },

    setPlayerPoints(state, { payload }) {
      const { points, player } = payload;
      state.playerPoints = state.playerPoints.map((item) => {
        const newPoints = item.player === player ? points : item.points;
        item.points = newPoints;
        return item;
      });
    },

    addCommonPoint(state) {
      state.commonPoints += 1;
    },

    addActiveCard(state, { payload }) {
      const { card, player } = payload;
      const stateOption = player === 'player1' ? 'activeCardPlayer1' : 'activeCardPlayer2';
      state[stateOption] = card;
    },

    deleteActiveCard(state, { payload }) {
      const { player } = payload;
      const stateOption = player === 'player1' ? 'activeCardPlayer1' : 'activeCardPlayer2';
      state[stateOption] = null;
    },

    addFieldContent(state, { payload }) {
      const { activeCard, id } = payload;
      const status = id !== 'postponed1' && id !== 'postponed2' ? 'field' : 'postponed';
      const changedActiveCard = { ...activeCard, status, cellId: id };
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
      const { card, cost } = payload;
      const { health } = card;
      const changedBasic = {
        ...card, status: 'hand', cellId: '', cost,
      };
      const changedCard = card.type === 'warrior' ? {
        ...changedBasic, currentHP: health, turn: 1, attachments: [],
      } : { ...changedBasic };
      const hand = changedCard.player === 'player1' ? 'playerOneHand' : 'playerTwoHand';
      state[hand] = [...state[hand], changedCard];
    },

    addToGraveyard(state, { payload }) {
      const { card } = payload;
      const { player } = card;
      const cellId = player === 'player1' ? 'graveyard1' : 'graveyard2';
      const newCard = { ...card, status: 'graveyard', cellId };
      state.fieldCells = state.fieldCells.map((cell) => {
        if (cell.type === 'graveyard' && cell.player === player) {
          cell.content = [newCard, ...cell.content];
        }
        return cell;
      });
    },

    turnCardLeft(state, { payload }) {
      const { cardId, cellId, qty } = payload;
      const newState = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          cell.content = cell.content.map((card) => {
            if (card.id === cardId && card.turn < 2) {
              card.turn += qty;
            }
            return card;
          });
        }
        return cell;
      });
      state.fieldCells = newState;
    },

    turnCardRight(state, { payload }) {
      const { cardId, cellId, qty } = payload;
      const newState = state.fieldCells.map((cell) => {
        if (cell.id === cellId) {
          cell.content = cell.content.map((card) => {
            if (card.id === cardId && card.turn > 0) {
              card.turn -= qty;
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
