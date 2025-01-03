import getEnemyPlayer from '../supportFunc/getEnemyPlayer';
import getRandomFromArray from '../getRandomFromArray';
import getRowForMiddleCell from './getRowForMiddleCell';
import isTwoWarsInRow from './isTwoEnemyiesInRow';
import findRowsWithWar from './findRowsWithWar';
import getWarsInLine from './getWarsNumInLine';
import isWarNeedToMove from './isWarNeedToMove';
import calcMaxWarsInLine from './calcMaxWarsInLine';

const findBestCellForSpellCast = ({
  fieldCards,
  fieldCells,
  cellsForSpellCast,
  card,
  getWarriorPower,
  warHasSpecialFeature,
  findSpells,
  enemyPoints,
}) => {
  const {
    aim, type, attach, name,
  } = card.features[0];
  if (card.place === 'bigSpell') {
    return getRandomFromArray(cellsForSpellCast);
  }
  if ((aim.includes('row') || (attach && attach.includes('row'))) && card.place === 'midSpell') {
    const rightPlayer = type === 'good' ? card.player : getEnemyPlayer(card.player);
    const rowsWithWar = findRowsWithWar(cellsForSpellCast, fieldCards, rightPlayer);
    if (rowsWithWar.length === 0) return getRandomFromArray(cellsForSpellCast);
    const rowsWithTwoWars = rowsWithWar
      .filter((cell) => isTwoWarsInRow(getRowForMiddleCell[cell], fieldCards, rightPlayer));
    return rowsWithTwoWars.length > 0
      ? getRandomFromArray(rowsWithTwoWars) : getRandomFromArray(rowsWithWar);
  }
  if (aim.includes('line') || (attach && attach.includes('line'))) {
    const maxWarsInLine = calcMaxWarsInLine(cellsForSpellCast, fieldCards);
    const cellsWithMaxWarsInLine = cellsForSpellCast
      .filter((cell) => getWarsInLine(cell, fieldCards, card) === maxWarsInLine);
    return getRandomFromArray(cellsWithMaxWarsInLine);
  }
  if (name === 'attack' && name === 'stun') {
    const warsInCells = fieldCards.filter((c) => cellsForSpellCast.includes(c.cellId) && (c.type === 'warrior' || c.type === 'hero'));
    const warsPowers = warsInCells.map((war) => getWarriorPower(war));
    const maxPower = Math.max(...warsPowers);
    const warWithMaxPower = warsInCells.find((war) => getWarriorPower(war) === maxPower);
    return warWithMaxPower.cellId;
  }
  if (name === 'power') {
    const warsInCells = fieldCards.filter((c) => cellsForSpellCast.includes(c.cellId) && (c.type === 'warrior' || c.type === 'hero'));
    const cellIdsWithArmedWars = warsInCells
      .filter((c) => !warHasSpecialFeature({
        warCard: c, fieldCards, fieldCells, featureName: 'unarmed',
      }) && c.turn === 0)
      .map((c) => c.cellId);

    return cellIdsWithArmedWars.length > 0
      ? getRandomFromArray(cellIdsWithArmedWars) : getRandomFromArray(cellsForSpellCast);
  }
  if (name === 'swift') {
    const warsInCells = fieldCards.filter((c) => cellsForSpellCast.includes(c.cellId) && (c.type === 'warrior' || c.type === 'hero'));
    const cellIdsWithMovableWars = warsInCells
      .filter((c) => !warHasSpecialFeature({
        warCard: c, fieldCards, fieldCells, featureName: 'immobile',
      }) && c.turn === 0 && isWarNeedToMove({
        warCard: c, findSpells, fieldCards, fieldCells, enemyPoints, getWarriorPower,
      }))
      .map((c) => c.cellId);

    return cellIdsWithMovableWars.length > 0
      ? getRandomFromArray(cellIdsWithMovableWars) : getRandomFromArray(cellsForSpellCast);
  }
  if (name === 'moving') {
    const warsInCells = fieldCards.filter((c) => cellsForSpellCast.includes(c.cellId) && (c.type === 'warrior' || c.type === 'hero'));
    const cellIdsWithMovableWars = warsInCells
      .filter((c) => isWarNeedToMove({
        warCard: c, findSpells, fieldCards, fieldCells, enemyPoints, getWarriorPower,
      }))
      .map((c) => c.cellId);

    return cellIdsWithMovableWars.length > 0
      ? getRandomFromArray(cellIdsWithMovableWars) : getRandomFromArray(cellsForSpellCast);
  }
  return getRandomFromArray(cellsForSpellCast);
};

export default findBestCellForSpellCast;
