const findTempSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.status === 'field' && card.subtype === 'temporary');

export default findTempSpellsOnField;
