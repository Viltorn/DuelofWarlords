import isCellEmpty from './isCellEmpty';
import findAdjasentCells from './findAdjasentCells';
import findNextCellsInLine from './findNextCellsInLine';
import findClosestWarrior from './findClosestWarrior';
import findNextRowToApply from './findNextRowToApply';
import isRightPlayerCellForSpell from './isRightPlayerCellForSpell';
import getEnemyPlayer from './getEnemyPlayer';

const findCellsForSpellApply = (data) => {
  const {
    feature, aimCell, player, currentFieldCells, currentFieldCards,
  } = data;
  const { type, aim } = feature;
  const rightPlayer = type === 'good' ? player : getEnemyPlayer(player);
  if (aim.includes('field')) {
    if (type === 'all') {
      return currentFieldCells.filter((cell) => cell.type === 'field');
    }
    if (type !== 'all') {
      return currentFieldCells.filter((cell) => cell.type === 'field' && cell.player === rightPlayer);
    }
  } else if (aim.includes('line')) {
    const { line } = aimCell;
    return currentFieldCells.filter((cell) => cell.line === line && !isCellEmpty(currentFieldCards, cell.id) && cell.type === 'field');
  } else if (aim.includes('row')) {
    if (type === 'all') {
      const { row } = aimCell;
      return currentFieldCells.filter((cell) => cell.row === row && !isCellEmpty(currentFieldCards, cell.id) && cell.type === 'field');
    }
    const { row } = aimCell;
    return currentFieldCells
      .filter((cell) => cell.row === row && !isCellEmpty(currentFieldCards, cell.id)
          && cell.type === 'field' && cell.player === rightPlayer);
  } else if (aim.includes('randomNextRow')) {
    return findNextRowToApply(aimCell, currentFieldCells, currentFieldCards, player, type);
  } else if (aim.includes('otherWarInRow')) {
    const playerToApply = type === 'bad' ? aimCell.player : getEnemyPlayer(aimCell.player);
    const foundCell = currentFieldCells.find((cell) => cell.player === playerToApply && cell.type === 'field'
        && cell.row === aimCell.row && !isCellEmpty(currentFieldCards, cell.id)
        && cell.line !== aimCell.line);
    return [foundCell] ?? [];
  } else if (aim.includes('closestEnemyInRow')) {
    const foundCell = findClosestWarrior(currentFieldCells, currentFieldCards, aimCell);
    return [foundCell] ?? [];
  } else if (aim.includes('otherAllyInRow')) {
    const foundCell = currentFieldCells.find((cell) => cell.player === aimCell.player && cell.type === 'field'
      && cell.row === aimCell.row && !isCellEmpty(currentFieldCards, cell.id)
      && cell.id !== aimCell.id);
    return [foundCell] ?? [];
  } else if (aim.includes('nextWarsInLine')) {
    return findNextCellsInLine(currentFieldCells, currentFieldCards, aimCell);
  } else if (aim.includes('adjacent')) {
    if (type === 'all') {
      return findAdjasentCells(currentFieldCells, aimCell)
        .filter((cell) => !isCellEmpty(currentFieldCards, cell.id));
    }
    return findAdjasentCells(currentFieldCells, aimCell)
      .filter((cell) => !isCellEmpty(currentFieldCards, cell.id) && cell.player === rightPlayer);
  } else if (aim.includes('oneAdjacent')) {
    const adjasentCells = findAdjasentCells(currentFieldCells, aimCell)
      .filter((cell) => !isCellEmpty(currentFieldCards, cell.id)
        && isRightPlayerCellForSpell(cell, player, type));
    return adjasentCells.length !== 0 ? [adjasentCells[0]] : [];
  } else if (aim.includes('redirectToCaster')) {
    const casterCard = currentFieldCards.find((card) => card.id === feature.id);
    return [currentFieldCells.find((cell) => cell.id === casterCard.cellId)];
  } else if (aim.includes('warInCell')) {
    return aimCell ? [aimCell] : [];
  }
  return null;
};

export default findCellsForSpellApply;
