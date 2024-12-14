const isWarInRow = (row, fieldCards, player) => (fieldCards
  .find((card) => card.cellId[0] === row && card.player === player && card.type === 'warrior'));

export default isWarInRow;
