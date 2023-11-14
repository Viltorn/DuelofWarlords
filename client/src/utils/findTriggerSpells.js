export default (card, cell, spelltype, cardtype) => {
  const triggerCellAttach = cell?.attachments?.filter((spell) => spell.condition === spelltype
    && spell.aim.includes(cardtype)) ?? [];
  const triggerCardAttach = card.attachments?.filter((spell) => spell.condition === spelltype
    && spell.aim.includes(cardtype)) ?? [];
  const triggerCardFeatures = card.features.filter((spell) => spell.condition === spelltype
  && spell.aim.includes(cardtype)) ?? [];
  return [...triggerCellAttach, ...triggerCardAttach, ...triggerCardFeatures];
};
