import isRightTurnForSpell from './isRightTurnForSpell';

export default (card, cell, spelltype, cardtype, turn) => {
  const triggerCellAttach = cell?.attachments?.filter((spell) => spell.condition === spelltype
    && spell.aim.includes(cardtype) && isRightTurnForSpell(spell, turn)) ?? [];
  const triggerCardAttach = card.attachments?.filter((spell) => spell.condition === spelltype
    && spell.aim.includes(cardtype) && isRightTurnForSpell(spell, turn)) ?? [];
  const triggerCardFeatures = card.features.filter((spell) => spell.condition === spelltype
  && spell.aim.includes(cardtype) && !spell.attach && isRightTurnForSpell(spell, turn)) ?? [];
  return [...triggerCellAttach, ...triggerCardAttach, ...triggerCardFeatures];
};
