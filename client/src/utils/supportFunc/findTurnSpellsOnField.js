const findTurnSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.status !== 'postponed' && card.subtype === 'turn');

export default findTurnSpellsOnField;
