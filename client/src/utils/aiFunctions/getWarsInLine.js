const getWarsInLine = (cellId, fieldCards, spellCard) => {
  const line = spellCard.place === 'topSpell' ? cellId : cellId[2];
  const warsInline = fieldCards.filter((card) => card.cellId[2] === line);
  return warsInline.length;
};

export default getWarsInLine;
