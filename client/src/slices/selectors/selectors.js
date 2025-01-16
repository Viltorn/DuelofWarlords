import { createSelector } from '@reduxjs/toolkit';

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

export const battleSelectors = {
  getCheckCardsData: createSelector(
    [(state) => ({
      fieldCells: state.battleReducer.fieldCells,
      fieldCards: state.battleReducer.fieldCards,
      playersDecks: state.battleReducer.playersDecks,
    }), (state, { id, player, data }) => ({ id, player, data })],
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
