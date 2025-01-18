const findTempSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.subtype === 'reaction' && card.status === 'field');

export default findTempSpellsOnField;
