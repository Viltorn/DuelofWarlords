const findActiveWarCard = (curFieldCards, player) => curFieldCards
  .find((card) => card.type === 'warrior' && card.status === 'field' && card.player === player && card.turn === 0);

export default findActiveWarCard;
