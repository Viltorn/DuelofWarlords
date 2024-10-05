const countSpellDependVal = ({ spell, aimCardPower, currentFieldCards }) => {
  const {
    depend, dependValue, value, id, player,
  } = spell;
  if (depend === 'goodAttachments') {
    const goodAttach = currentFieldCards.filter((card) => card.type === 'spell'
      && card.player === player && card.status === 'field');
    return dependValue * goodAttach.length;
  }
  if (depend === 'warriorsDiff') {
    const goodWarriorsQty = currentFieldCards.filter((card) => card.type === 'warrior'
      && card.player === player && card.status === 'field').length;
    const enemyPlayer = player === 'player1' ? 'player2' : 'player1';
    const badWarriorsQty = currentFieldCards.filter((card) => card.type === 'warrior'
      && card.player === enemyPlayer && card.status === 'field').length;
    const diff = badWarriorsQty - goodWarriorsQty > 0 ? badWarriorsQty - goodWarriorsQty : 0;
    return value + dependValue * diff;
  }
  if (depend === 'postponed') {
    const cardWithFeature = currentFieldCards.find((card) => card.id === id);
    const cellId = cardWithFeature?.cellId;
    if (cellId === 'postponed1' || cellId === 'postponed2') {
      return dependValue;
    }
  }
  if (depend === 'attackerPower') {
    return aimCardPower;
  }
  return value;
};

export default countSpellDependVal;
