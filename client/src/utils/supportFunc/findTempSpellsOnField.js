const findTempSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.status !== 'postponed' && card.subtype === 'temporary');

export default findTempSpellsOnField;
