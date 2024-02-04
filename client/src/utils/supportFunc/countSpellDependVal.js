const countSpellDependVal = (spell, spellOwner, allFieldCells, curFieldCards) => {
  const {
    depend, dependValue, value, id,
  } = spell;
  if (depend === 'goodAttachments') {
    const goodAttach = curFieldCards.filter((card) => card.type === 'spell'
      && card.player === spellOwner && card.status === 'field');
    return dependValue * goodAttach.length;
  }
  if (depend === 'warriorsDiff') {
    const goodWarriorsQty = curFieldCards.filter((card) => card.type === 'warrior'
      && card.player === spellOwner && card.status === 'field').length;
    const enemyPlayer = spellOwner === 'player1' ? 'player2' : 'player1';
    const badWarriorsQty = curFieldCards.filter((card) => card.type === 'warrior'
      && card.player === enemyPlayer && card.status === 'field').length;
    const diff = badWarriorsQty - goodWarriorsQty > 0 ? badWarriorsQty - goodWarriorsQty : 0;
    return value + dependValue * diff;
  }
  if (depend === 'postponed') {
    const cardWithFeature = curFieldCards.find((card) => card.id === id);
    const cellId = cardWithFeature?.cellId;
    if (cellId === 'postponed1' || cellId === 'postponed2') {
      return dependValue;
    }
  }
  return value;
};

export default countSpellDependVal;
