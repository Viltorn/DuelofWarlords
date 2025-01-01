const isWarInRow = (rowId, fieldCards, player) => (fieldCards
  .find((card) => card.cellId[0] === rowId && card.player === player && card.type === 'warrior'));

export default isWarInRow;
