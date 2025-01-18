/* eslint-disable max-len */
import { createSelector } from '@reduxjs/toolkit';

const getInfoForCardsExtraction = (state, { id, player, data }) => ({ id, player, data });

const getCardsToShow = {
  grave: ({ fieldCells, player, fieldCards }) => {
    const graveyardCellId = fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard').id;
    return fieldCards.filter((card) => card.cellId === graveyardCellId);
  },
  deck: ({ playersDecks, player }) => playersDecks[player],
  attached: ({ data, player }) => {
    const goodCards = data.filter((card) => card.player === player);
    const badCards = data.filter((card) => card.player !== player);
    return [...badCards, ...goodCards];
  },
};

const getBattleReducer = (state) => state.battleReducer;

const fieldCardsData = createSelector([getBattleReducer], (battleReducer) => battleReducer.fieldCards);
const fieldCellsData = createSelector([getBattleReducer], (battleReducer) => battleReducer.fieldCells);
const fieldPlayerDecksData = createSelector([getBattleReducer], (battleReducer) => battleReducer.playersDecks);

const getStateData = createSelector([fieldCardsData, fieldCellsData, fieldPlayerDecksData], (fieldCards, fieldCells, playableDecks) => ({ fieldCards, fieldCells, playableDecks }));

export const battleSelectors = {
  getCheckCardsData: createSelector(
    [getStateData, getInfoForCardsExtraction],
    (stateData, { id, player, data }) => getCardsToShow[id]({
      ...stateData, player, data,
    }),
  ),
};

export const gameSelectors = {
  getCheckCardsData: createSelector(
    [(state) => state.battleReducer, (id) => id],
    ((timer) => timer),
  ),
};
