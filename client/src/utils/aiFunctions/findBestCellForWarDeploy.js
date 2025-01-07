import isWarInRow from './isWarInRow';
import getEnemyPlayer from '../supportFunc/getEnemyPlayer';
import getRandomFromArray from '../getRandomFromArray';

export default (fieldCards, availableCells, card) => {
  const enemyPlayer = getEnemyPlayer(card.player);
  const preferableCellsIDsInLine = card.subtype === 'flyer' || card.subtype === 'shooter'
    ? availableCells.filter((cellId) => (cellId[2] === '2' || cellId[2] === '4')) : availableCells.filter((cellId) => (cellId[2] === '1' || cellId[2] === '3'));
  const preferableCellsIDsInRow = card.subtype === 'flyer' || card.subtype === 'shooter' ? preferableCellsIDsInLine.filter((cell) => !isWarInRow(cell[0], fieldCards, enemyPlayer))
    : preferableCellsIDsInLine.filter((cell) => isWarInRow(cell[0], fieldCards, enemyPlayer));
  const preferablesCells = preferableCellsIDsInRow.length > 0
    ? preferableCellsIDsInRow : preferableCellsIDsInLine;

  const aiHeroHP = fieldCards.find((c) => c.type === 'hero' && c.player === card.player);
  const unprotectedCells = preferableCellsIDsInLine.filter((cellId) => {
    const enemyWar = isWarInRow(cellId[0], fieldCards, enemyPlayer);
    const allyWar = isWarInRow(cellId[0], fieldCards, card.player);
    return enemyWar && !allyWar;
  });

  if (unprotectedCells.length > 0 && aiHeroHP < 10) return getRandomFromArray(unprotectedCells);

  return preferablesCells.length > 0
    ? getRandomFromArray(preferablesCells) : getRandomFromArray(availableCells);
};
