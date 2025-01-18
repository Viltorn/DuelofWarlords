const findTurnSpellsOnField = (curFieldCards, player) => curFieldCards
  .filter((card) => card.player === player && card.subtype === 'turn' && card.status === 'field');

export default findTurnSpellsOnField;
