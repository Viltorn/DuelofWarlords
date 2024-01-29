const findCellByContentId = (spellId, curFieldCells, curFieldCards) => {
  const redirectCard = curFieldCards.find((card) => card.id === spellId);
  if (redirectCard) {
    return curFieldCells.find((cell) => cell.id === redirectCard.cellId);
  }
  return null;
};

export default findCellByContentId;
