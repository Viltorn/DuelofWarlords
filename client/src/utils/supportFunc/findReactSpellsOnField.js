const findTempSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.subtype === 'reaction');

export default findTempSpellsOnField;
