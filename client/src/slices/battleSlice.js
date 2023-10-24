/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import createFieldCells from '../utils/makeFieldCells.js';
import {
  bigSpell, topSpells, midSpells, heroes, postponed, graveyard, fieldCells,
} from '../gameData/heroes&spellsCellsData.js';

const initialState = {
  commonPoints: 0,
  playerPoints: [{ player: 'player1', points: 1 }, { player: 'player2', points: 1 }],
  players: { player1: { name: '', id: 'player1', cardsdrawn: false }, player2: { name: '', id: 'player2', cardsdrawn: false } },
  thisPlayer: 'player1',
  gameTurn: 'player1',
  playersDecks: { player1: [], player2: [] },
  playersHands: { player1: [], player2: [] },
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

    setThisPlayer(state, { payload }) {
      const { player } = payload;
      state.thisPlayer = player;
    },

    changeTurn(state, { payload }) {
      const { player } = payload;
      state.gameTurn = player;
    },

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

    activateCells(state, { payload }) {
      const { ids } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (ids.includes(cell.id)) {
          cell.disabled = false;
        }
        return cell;
      });
    },

    disableCells(state, { payload }) {
      const { ids } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (ids.includes(cell.id)) {
          cell.disabled = true;
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

    setHero(state, { payload }) {
      const { hero, player } = payload;
      state.fieldCells = state.fieldCells.map((cell) => {
        if (cell.type === 'hero' && cell.player === player) {
          cell.content = [{ ...hero, cellId: cell.id, player }];
        }
        return cell;
      });
    },

    setPlayersDeck(state, { payload }) {
      const { deck, player } = payload;
      state.playersDecks[player] = deck;
    },

    setPlayersHand(state, { payload }) {
      const { hand, player } = payload;
      state.playersHands[player] = hand;
    },

    setPlayerName(state, { payload }) {
      const { name, player } = payload;
      state.players[player].name = name;
    },

    drawCard(state, { payload }) {
      const { player } = payload;
      if (state.playersDecks[player].length !== 0) {
        const card = state.playersDecks[player].shift();
        state.playersHands[player] = [card, ...state.playersHands[player]];
      }
    },

    sendCardtoDeck(state, { payload }) {
      const { card } = payload;
      const { player } = card;
      state.playersDecks[player] = [...state.playersDecks[player], card];
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
      const { card, id } = payload;
      const status = id !== 'postponed1' && id !== 'postponed2' ? 'field' : 'postponed';
      const changedCard = { ...card, status, cellId: id };
      const newFieldCells = state.fieldCells.map((cell) => {
        if (cell.id === id) {
          cell.content = [changedCard, ...cell.content];
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
      const { health, player } = card;
      const changedBasic = {
        ...card, status: 'hand', cellId: '', currentC: cost,
      };
      const changedCard = card.type === 'warrior' ? {
        ...changedBasic, currentHP: health, turn: 1, attachments: [],
      } : { ...changedBasic };
      state.playersHands[player] = [...state.playersHands[player], changedCard];
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
      state.playersHands[player] = state.playersHands[player].filter((card) => card.id !== cardId);
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
