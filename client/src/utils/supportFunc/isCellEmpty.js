const isCellEmpty = (fieldCards, cellId) => {
  const fieldCardCellIds = fieldCards.map((card) => card.cellId);
  return !fieldCardCellIds.includes(cellId);
};

export default isCellEmpty;
