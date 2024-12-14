const isTwoWarsInRow = (row, fieldCards, player) => {
  const warsInCell = fieldCards.filter((card) => card.cellId[0] === row && card.player === player && card.type === 'warrior');
  return warsInCell.length > 1;
};

export default isTwoWarsInRow;
