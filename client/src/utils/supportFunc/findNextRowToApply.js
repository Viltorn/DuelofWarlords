const findNextRowToApply = (aimCell, currentFieldCells, player) => {
  const currentRowNumber = parseInt(aimCell.row, 10);
  const topRowNumber = (currentRowNumber - 1).toString();
  const bottomRowNumber = (currentRowNumber + 1).toString();
  const topRowCells = currentFieldCells.filter((cell) => cell.row === topRowNumber
    && cell.content.length !== 0 && cell.player !== player && cell.type === 'field');
  const bottomRowCells = currentFieldCells.filter((cell) => cell.row === bottomRowNumber
    && cell.content.length !== 0 && cell.player !== player && cell.type === 'field');
  return topRowCells.length !== 0 ? topRowCells : bottomRowCells;
};

export default findNextRowToApply;
