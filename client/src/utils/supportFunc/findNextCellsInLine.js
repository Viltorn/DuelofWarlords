const findNextCellsInLine = (aimCell, currentFieldCells, player) => {
  const currentRowNumber = parseInt(aimCell.row, 10);
  const currentLine = aimCell.line;
  const topRowNum = (currentRowNumber - 1).toString();
  const botRowNum = (currentRowNumber + 1).toString();
  const nextCellsWithWars = currentFieldCells
    .filter((cell) => (cell.row === topRowNum || cell.row === botRowNum)
    && cell.line === currentLine && cell.content.length !== 0 && cell.player === player && cell.type === 'field');
  return nextCellsWithWars;
};

export default findNextCellsInLine;
