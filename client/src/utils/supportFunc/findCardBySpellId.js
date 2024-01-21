const findCardBySpellId = (id, allFieldCells) => allFieldCells.reduce((acc, cell) => {
  const searchingCard = cell.content.find((el) => el.id === id);
  if (searchingCard) {
    acc = searchingCard;
  }
  return acc;
}, null);

export default findCardBySpellId;
