/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import createFieldCells from '../utils/makeFieldCells.js';
import {
  bigSpell, topSpells, midSpells, heroes, postponed, graveyard, fieldCells,
} from '../gameData/heroes&spellsCellsData.js';

const initialState = {
  commonPoints: 0,
  playerPoints: [{ player: 'player1', points: 1 }, { player: 'player2', points: 1 }],
  players: {
    player1: {
      name: '', id: 'player1', cardsdrawn: false, switchedcard: true,
    },
    player2: {
      name: '', id: 'player2', cardsdrawn: false, switchedcard: true,
    },
  },
  thisPlayer: 'player1',
  gameTurn: 'player1',
  playersDecks: { player1: [], player2: [] },
  playersHands: { player1: [], player2: [] },
  fieldCards: [],
  fieldCells: [
    ...createFieldCells(fieldCells),
    ...bigSpell,
    ...topSpells,
    ...midSpells,
    ...heroes,
    ...postponed,
    ...graveyard,
  ],
  activeCells: { cellsForAttack: [], cellsForSpellCast: [], cellsForWarMove: [] },
  lastCellWithAction: {},
  activeCardPlayer1: null,
  activeCardPlayer2: null,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    resetState: () => initialState,

    setLastCellWithAction(state, { payload }) {
      const { cellActionData } = payload;
      state.lastCellWithAction = cellActionData;
    },

    setActiveCells(state, { payload }) {
      const { cellsIds, type } = payload;
      state.activeCells[type] = cellsIds;
    },

    addActiveCells(state, { payload }) {
      const { cellsIds, type } = payload;
      state.activeCells[type] = [...state.activeCells[type], ...cellsIds];
    },

    setThisPlayer(state, { payload }) {
      const { player } = payload;
      state.thisPlayer = player;
    },

    changeTurn(state, { payload }) {
      const { player } = payload;
      state.gameTurn = player;
    },

    addCellAttachment(state, { payload }) {
      const { cellId, feature } = payload;
      const cellIndex = state.fieldCells.findIndex((cell) => cell.id === cellId);
      state.fieldCells[cellIndex].attachments.push(feature);
    },
    addWarriorAttachment(state, { payload }) {
      const { cellId, feature } = payload;
      const cellIndex = state.fieldCards.findIndex((card) => card.cellId === cellId
      && (card.type === 'warrior' || card.type === 'hero'));
      state.fieldCards[cellIndex].attachments.push(feature);
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
        return cell;
      });
      state.fieldCards = state.fieldCards.map((card) => {
        card.attachments = card.attachments?.filter((attach) => attach.id !== spellId);
        return card;
      });
    },

    addAnimation(state, { payload }) {
      const { cellId, type } = payload;
      const index = state.fieldCells.findIndex((cell) => cell.id === cellId);
      state.fieldCells[index].animation = type;
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

    setCardSwitchStatus(state, { payload }) {
      const { player, status } = payload;
      state.players[player].switchedcard = status;
    },

    turnPostponed(state, { payload }) {
      const { player, status } = payload;
      const index = state.fieldCells.findIndex((cell) => cell.type === 'postponed' && cell.player === player);
      const postponedCard = state.fieldCards
        .find((card) => card.cellId === state.fieldCells[index].id);
      state.fieldCells[index].status = status === 'face' && postponedCard ? 'face' : 'cover';
    },

    massTurnCards(state, { payload }) {
      const { player } = payload;
      state.fieldCards = state.fieldCards.map((card) => {
        if (card.player === player && card.status !== 'postponed' && (card.type === 'hero' || card.type === 'warrior')) {
          card.turn = card.turn > 0 ? card.turn - 1 : card.turn;
        }
        return card;
      });
    },

    setHero(state, { payload }) {
      const { hero, player } = payload;
      const cellId = player === 'player1' ? 'hero1' : 'hero2';
      const heroCard = { ...hero, cellId, player };
      state.fieldCards.push(heroCard);
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
      state.playersDecks[player].push(card);
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
      state.fieldCards.unshift(changedCard);
    },

    deleteFieldCard(state, { payload }) {
      const { cardId } = payload;
      state.fieldCards = state.fieldCards.filter((card) => card.id !== cardId);
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
      state.playersHands[player].push(changedCard);
    },

    addToGraveyard(state, { payload }) {
      const { card } = payload;
      const {
        player, type, health, cost,
      } = card;
      const cellId = player === 'player1' ? 'graveyard1' : 'graveyard2';
      const changedBasic = { ...card, status: 'graveyard', cellId };
      const newCard = type === 'warrior' ? {
        ...changedBasic, turn: 1, currentHP: health, attachments: [], currentC: cost,
      }
        : changedBasic;
      state.fieldCards.push(newCard);
    },

    turnCardLeft(state, { payload }) {
      const { cardId, qty } = payload;
      const index = state.fieldCards.findIndex((card) => card.id === cardId);
      const currentTurn = state.fieldCards[index].turn;
      state.fieldCards[index].turn = currentTurn < 2 ? currentTurn + qty : currentTurn;
    },

    turnCardRight(state, { payload }) {
      const { cardId, qty } = payload;
      const index = state.fieldCards.findIndex((card) => card.id === cardId);
      const currentTurn = state.fieldCards[index].turn;
      state.fieldCards[index].turn = currentTurn > 0 ? currentTurn - qty : currentTurn;
    },

    deleteHandCard(state, { payload }) {
      const { player, cardId } = payload;
      state.playersHands[player] = state.playersHands[player].filter((card) => card.id !== cardId);
    },

    changeHP(state, { payload }) {
      const { health, cardId } = payload;
      const index = state.fieldCards.findIndex((card) => card.id === cardId);
      state.fieldCards[index].currentHP = health;
    },
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
