import getEnemyPlayer from '../supportFunc/getEnemyPlayer';
import getRowForMiddleCell from './getRowForMiddleCell';
import isTwoWarsInRow from './isTwoEnemyiesInRow';
import isWarInRow from './isWarInRow';
import getWarsInLine from './getWarsInLine';

export default (fieldCards, availableCells, card) => {
  const { aim, type } = card.features[0];
  if (aim.includes('row') && card.place === 'midSpell') {
    const rightPlayer = type === 'good' ? card.player : getEnemyPlayer(card.player);
    const rowsWithWar = availableCells
      .filter((cell) => isWarInRow(getRowForMiddleCell[cell], fieldCards, rightPlayer));
    if (rowsWithWar.length === 0) return availableCells;
    const rowsWithTowWars = rowsWithWar
      .filter((cell) => isTwoWarsInRow(getRowForMiddleCell[cell], fieldCards, rightPlayer));
    return rowsWithTowWars.length > 0 ? rowsWithTowWars : rowsWithWar;
  }
  if (aim.includes('line')) {
    const warsInEachLine = availableCells.map((cell) => getWarsInLine(cell, fieldCards, card));
    const maxWarsInLine = Math.max(...warsInEachLine);
    return availableCells.filter((cell) => getWarsInLine(cell, fieldCards, card) === maxWarsInLine);
  }
  return availableCells;
};
