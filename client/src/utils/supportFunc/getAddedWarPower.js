import countSpellDependVal from './countSpellDependVal';

const getAddedWarPower = ({
  aimCardPower, currentFieldCards, attachedSpells, appliedCard, currentFieldCells,
}) => {
  const totalPower = attachedSpells.reduce((acc, spell) => {
    const spellPower = spell.depend
      ? countSpellDependVal({
        spell, aimCardPower, currentFieldCards, appliedCard, currentFieldCells,
      }) : spell.value;
    acc += spellPower;
    return acc;
  }, 0);
  return totalPower;
};

export default getAddedWarPower;
