import isCellEmpty from './isCellEmpty';

const findNextCellsInLine = (fieldCells, fieldCards, aimCell) => {
  const currentRowNumber = parseInt(aimCell.row, 10);
  const currentLine = aimCell.line;
  const topRowNum = (currentRowNumber - 1).toString();
  const botRowNum = (currentRowNumber + 1).toString();
  const nextCellsWithWars = fieldCells
    .filter((cell) => (cell.row === topRowNum || cell.row === botRowNum)
    && cell.line === currentLine && !isCellEmpty(fieldCards, cell.id) && cell.type === 'field');
  return nextCellsWithWars;
};

export default findNextCellsInLine;
