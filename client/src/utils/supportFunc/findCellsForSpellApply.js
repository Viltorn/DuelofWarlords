import isCellEmpty from './isCellEmpty';
import findAdjasentCells from './findAdjasentCells';
import findNextCellsInLine from './findNextCellsInLine';
import findClosestWarrior from './findClosestWarrior';
import findNextRowToApply from './findNextRowToApply';
import isRightPlayerCellForSpell from './isRightPlayerCellForSpell';

const findCellsForSpellApply = (data) => {
  const {
    feature, aimCell, player, currentFieldCells, currentFieldCards,
  } = data;
  const { type, aim } = feature;
  if (aim.includes('field')) {
    if (type === 'all') {
      return currentFieldCells.filter((cell) => cell.type === 'field');
    }
  } else if (aim.includes('line')) {
    const { line } = aimCell;
    return currentFieldCells.filter((cell) => cell.line === line && !isCellEmpty(currentFieldCards, cell.id) && cell.type === 'field');
  } else if (aim.includes('row')) {
    if (type === 'all') {
      const { row } = aimCell;
      return currentFieldCells.filter((cell) => cell.row === row && !isCellEmpty(currentFieldCards, cell.id) && cell.type === 'field');
    }
    if (type === 'bad') {
      const { row } = aimCell;
      return currentFieldCells
        .filter((cell) => cell.row === row && !isCellEmpty(currentFieldCards, cell.id)
          && cell.type === 'field' && cell.player !== player);
    }
  } else if (aim.includes('randomNextRow')) {
    return findNextRowToApply(aimCell, currentFieldCells, currentFieldCards, player, type);
  } else if (aim.includes('otherWarInRow')) {
    if (type === 'bad') {
      const foundCell = currentFieldCells.find((cell) => cell.player === aimCell.player && cell.type === 'field'
        && cell.row === aimCell.row && !isCellEmpty(currentFieldCards, cell.id)
        && cell.line !== aimCell.line);
      return [foundCell] ?? [];
    }
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
    if (type === 'good') {
      return findAdjasentCells(currentFieldCells, aimCell)
        .filter((cell) => !isCellEmpty(currentFieldCards, cell.id) && cell.player === player);
    }
  } else if (aim.includes('oneAdjacent')) {
    const adjasentCells = findAdjasentCells(currentFieldCells, aimCell)
      .filter((cell) => !isCellEmpty(currentFieldCards, cell.id)
        && isRightPlayerCellForSpell(cell, player, type));
    return adjasentCells.length !== 0 ? [adjasentCells[0]] : [];
  }
  return null;
};

export default findCellsForSpellApply;
