import countSpellDependVal from './countSpellDependVal';

const getAddedWarPower = (curFieldCells, curFieldCards, player, spells) => {
  const totalPower = spells.reduce((acc, spell) => {
    const spellPower = spell.depend
      ? countSpellDependVal(spell, player, curFieldCells, curFieldCards) : spell.value;
    acc += spellPower;
    return acc;
  }, 0);
  return totalPower;
};

export default getAddedWarPower;
