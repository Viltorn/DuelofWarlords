const getPlayerCellIds = (player, allFieldCells) => allFieldCells.reduce((acc, cell) => {
  if (cell.type === 'field' && cell.player === player) {
    acc = [...acc, cell.id];
  }
  return acc;
}, []);

export default getPlayerCellIds;
