import countSpellDependVal from './countSpellDependVal';

export default ({
  spells, aimCardPower, currentFieldCards, lastPlayedCard,
}) => spells.reduce((value, spell) => {
  value += countSpellDependVal({
    spell, aimCardPower, currentFieldCards, lastPlayedCard,
  });
  return value;
}, 0);
