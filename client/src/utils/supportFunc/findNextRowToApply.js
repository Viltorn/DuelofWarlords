import isCellEmpty from './isCellEmpty';

const findNextRowToApply = (aimCell, fieldCells, fieldCards, player) => {
  const currentRowNumber = parseInt(aimCell.row, 10);
  const topRowNumber = (currentRowNumber - 1).toString();
  const bottomRowNumber = (currentRowNumber + 1).toString();
  const topRowCells = fieldCells.filter((cell) => cell.row === topRowNumber
    && !isCellEmpty(fieldCards, cell.id) && cell.player !== player && cell.type === 'field');
  const bottomRowCells = fieldCells.filter((cell) => cell.row === bottomRowNumber
    && !isCellEmpty(fieldCards, cell.id) && cell.player !== player && cell.type === 'field');
  return topRowCells.length !== 0 ? topRowCells : bottomRowCells;
};

export default findNextRowToApply;
