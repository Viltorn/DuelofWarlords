import isCellEmpty from './isCellEmpty';

const findNextRows = (fieldCell, cellsfield, fieldCards) => {
  const currentRowNumber = parseInt(fieldCell.row, 10);
  const currentline = fieldCell.line;
  const topRowNumber = (currentRowNumber - 1).toString();
  const bottomRowNumber = (currentRowNumber + 1).toString();
  const topRowCell = cellsfield.find((cell) => cell.row === topRowNumber
          && cell.line === currentline && isCellEmpty(fieldCards, cell.id));
  const bottomRowCell = cellsfield.find((cell) => cell.row === bottomRowNumber
          && cell.line === currentline && isCellEmpty(fieldCards, cell.id));
  return { topRowCell, bottomRowCell };
};

export default findNextRows;
