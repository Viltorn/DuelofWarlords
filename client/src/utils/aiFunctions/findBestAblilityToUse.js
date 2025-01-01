const findBestAbilityToUse = (attachedAbilities, cardAbilities, warCard, playersHands) => {
  const playerHandLength = playersHands[warCard.player].length;
  if (warCard.type === 'hero' && playerHandLength === 1 && warCard.currentHP < 10) {
    return cardAbilities.find((ability) => ability.name === 'drawCard');
  }
  return attachedAbilities.length > 0 ? attachedAbilities : cardAbilities;
};

export default findBestAbilityToUse;
