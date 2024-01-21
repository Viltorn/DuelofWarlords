const findClosestWarrior = (cells, aimCell) => {
  const enemy = aimCell.player === 'player1' ? 'player2' : 'player1';
  const filteredCells = cells.filter((cell) => cell.player === enemy
 && cell.row === aimCell.row && cell.content.length !== 0 && cell.type === 'field');
  if (filteredCells.length === 1) {
    return filteredCells[0];
  }
  if (filteredCells.length > 1) {
    const targetLine = enemy === 'player2' ? '3' : '1';
    return filteredCells.find((cell) => cell.line === targetLine);
  }
  return null;
};

export default findClosestWarrior;
