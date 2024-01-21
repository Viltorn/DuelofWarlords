const findNextRows = (fieldCell, cellsfield) => {
  const currentRowNumber = parseInt(fieldCell.row, 10);
  const currentline = fieldCell.line;
  const topRowNumber = (currentRowNumber - 1).toString();
  const bottomRowNumber = (currentRowNumber + 1).toString();
  const topRowCell = cellsfield.find((cell) => cell.row === topRowNumber
          && cell.line === currentline && cell.content.length === 0);
  const bottomRowCell = cellsfield.find((cell) => cell.row === bottomRowNumber
          && cell.line === currentline && cell.content.length === 0);
  return { topRowCell, bottomRowCell };
};

export default findNextRows;
