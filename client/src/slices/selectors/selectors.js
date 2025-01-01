import { createSelector } from '@reduxjs/toolkit';

export const battleSelectors = {
  getTimer: createSelector(
    (state) => state.battleReducer.turnTimer,
    ((timer) => timer),
  ),
};

export const gameSelectors = {
  getTimer: createSelector(
    (state) => state.gameReducer.turnTimer,
    ((timer) => timer),
  ),
};
