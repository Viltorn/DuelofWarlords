import isCellEmpty from './isCellEmpty';
import isRightPlayerCellForSpell from './isRightPlayerCellForSpell';

const findNextRowToApply = (aimCell, fieldCells, fieldCards, castingPlayer, type) => {
  const currentRowNumber = parseInt(aimCell.row, 10);
  const topRowNumber = (currentRowNumber - 1).toString();
  const bottomRowNumber = (currentRowNumber + 1).toString();
  const topRowCells = fieldCells.filter((cell) => cell.row === topRowNumber
    && !isCellEmpty(fieldCards, cell.id) && isRightPlayerCellForSpell(cell, castingPlayer, type) && cell.type === 'field');
  const bottomRowCells = fieldCells.filter((cell) => cell.row === bottomRowNumber
    && !isCellEmpty(fieldCards, cell.id) && isRightPlayerCellForSpell(cell, castingPlayer, type) && cell.type === 'field');
  return topRowCells.length !== 0 ? topRowCells : bottomRowCells;
};

export default findNextRowToApply;
