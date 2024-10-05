const findTurnSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.subtype === 'turn');

export default findTurnSpellsOnField;
