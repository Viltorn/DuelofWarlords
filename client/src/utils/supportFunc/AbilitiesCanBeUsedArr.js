const findAbilitiesCanBeUsed = (card, playerPoinst) => {
  const cardAbilities = card.features.filter((feat) => feat.condition === 'insteadatk' && !feat.attach);
  const attachedAbilities = card.attachments?.filter((feat) => feat.condition === 'insteadatk') ?? [];
  const abilities = [...cardAbilities, ...attachedAbilities];
  return abilities.filter((ability) => {
    const leftPoints = ability.cost ? playerPoinst - ability.cost : 0;
    return leftPoints >= 0;
  });
};

export default findAbilitiesCanBeUsed;
