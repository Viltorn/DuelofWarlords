const countSpellDependVal = ({
  spell, aimCardPower, currentFieldCards, lastPlayedCard,
}) => {
  const {
    depend, dependValue, value, id, player, school,
  } = spell;
  console.log(player);
  if (!depend) {
    return value;
  }
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
    console.log(badWarriorsQty);
    console.log(badWarriorsQty - goodWarriorsQty);
    const diff = (badWarriorsQty - goodWarriorsQty) > 0 ? badWarriorsQty - goodWarriorsQty : 0;
    console.log(diff);
    return value + (dependValue * diff);
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
  if (depend === 'lastPlayedIsSpell') {
    const isLastPlayedCardIsSpell = lastPlayedCard.type === 'spell' && lastPlayedCard.player === player;
    return value + (isLastPlayedCardIsSpell ? dependValue : 0);
  }
  if (depend === 'sameSchoolSpellOnFiled') {
    const isRightSpellOnField = currentFieldCards.find((c) => c.player === player && c.status === 'field' && c.school === school);
    return value + (isRightSpellOnField ? dependValue : 0);
  }
  return value;
};

export default countSpellDependVal;
