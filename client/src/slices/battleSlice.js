/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import createFieldCells from '../utils/makeFieldCells.js';
import {
  bigSpell, topSpells, midSpells, heroes, counters, graveyard, fieldCells,
} from '../gameData/heroes&spellsCellsData.js';

const initialState = {
  roundNumber: 1,
  playerPoints: [{ player: 'player1', maxPoints: 1, points: 1 }, { player: 'player2', maxPoints: 1, points: 1 }],
  players: {
    player1: {
      name: '', id: 'player1', cardsdrawn: false, sucrificedCard: true, type: 'human',
    },
    player2: {
      name: '', id: 'player2', cardsdrawn: false, sucrificedCard: true, type: 'human',
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
    ...counters,
    ...graveyard,
  ],
  combatLog: [],
  roomMsgs: [],
  activeCells: { cellsForAttack: [], cellsForSpellCast: [], cellsForWarMove: [] },
  lastCellWithAction: {},
  lastPlayedCard: {},
  activeCardPlayer1: null,
  activeCardPlayer2: null,
  currentTutorStep: 0,
};

const battleSlice = createSlice({
  name: 'battle',
  initialState,
  reducers: {
    resetState: () => initialState,

    setTutorialStep(state, { payload }) {
      const step = payload;
      state.currentTutorStep = step;
    },

    changeFieldCardDisability(state, { payload }) {
      const { card, disabled } = payload;
      const cardIndex = state.fieldCards.findIndex((c) => c.id === card.id);
      state.fieldCards[cardIndex].disabled = disabled;
    },

    changeRound(state) {
      state.roundNumber += 1;
    },

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
      if (index >= 0) {
        state.fieldCells[index].animation = type;
      }
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

    setCardSucrificeStatus(state, { payload }) {
      const { player, status } = payload;
      state.players[player].sucrificedCard = status;
    },

    massTurnCards(state, { payload }) {
      const { player } = payload;
      state.fieldCards = state.fieldCards.map((card) => {
        if (card.player === player && (card.type === 'hero' || card.type === 'warrior')) {
          card.turn = card.turn > 0 ? card.turn - 1 : card.turn;
          card.justDeployed = false;
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

    setThisPlayer(state, { payload }) {
      const { player } = payload;
      state.thisPlayer = player;
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

    setPlayerType(state, { payload }) {
      const { type, player } = payload;
      state.players[player].type = type;
    },

    drawCard(state, { payload }) {
      const { player } = payload;
      if (state.playersDecks[player].length === 0) return;
      const card = state.playersDecks[player].shift();
      const handCard = { ...card, status: 'hand' };
      state.playersHands[player] = [handCard, ...state.playersHands[player]];
    },

    drawSpecificCard(state, { payload }) {
      const { player, cardName } = payload;
      if (state.playersDecks[player].length === 0) return;
      const card = state.playersDecks[player].find((c) => c.description === cardName);
      if (card) {
        state.playersDecks[player] = state.playersDecks[player].filter((c) => c.id !== card.id);
        const handCard = { ...card, status: 'hand' };
        state.playersHands[player] = [handCard, ...state.playersHands[player]];
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
        if (item.player === player) item.points = points >= 0 ? points : 0;
        return item;
      });
    },

    setPlayerMaxPoints(state, { payload }) {
      const { maxPoints, player } = payload;
      state.playerPoints = state.playerPoints.map((item) => {
        item.maxPoints = item.player === player ? maxPoints : item.maxPoints;
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

    deleteDeckCard(state, { payload }) {
      const { cardId, player } = payload;
      state.playersDecks[player] = state.playersDecks[player].filter((c) => c.id !== cardId);
    },

    returnCard(state, { payload }) {
      const { card, cost, playerHand } = payload;
      const {
        health, type, curCharges, charges,
      } = card;
      const changedBasic = {
        ...card, status: 'hand', cellId: '', currentC: cost, player: playerHand,
      };
      const chargedCard = curCharges ? { ...changedBasic, curCharges: charges } : changedBasic;
      const changedCard = type === 'warrior' ? {
        ...chargedCard, currentHP: health, turn: 1, attachments: [],
      } : { ...chargedCard };
      state.playersHands[playerHand].push(changedCard);
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
      state.fieldCards.unshift(newCard);
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

    changeSpellCharges(state, { payload }) {
      const { newCharges, cardId } = payload;
      const index = state.fieldCards.findIndex((card) => card.id === cardId);
      state.fieldCards[index].curCharges = newCharges;
    },

    setLastPlayedCard(state, { payload }) {
      const card = payload;
      state.lastPlayedCard = card;
    },

    addActionToLog(state, { payload }) {
      state.combatLog = [...state.combatLog, payload];
    },

    addMessage(state, { payload }) {
      const { data } = payload;
      state.roomMsgs = [...state.roomMsgs, data];
    },
  },
});

export const { actions } = battleSlice;
export default battleSlice.reducer;
