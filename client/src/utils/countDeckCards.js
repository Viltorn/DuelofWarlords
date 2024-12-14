export default (cards) => {
  const cardsNmb = cards.reduce((acc, card) => {
    acc += card.qty;
    return acc;
  }, 0);
  const spellsNmb = cards
    .filter((card) => card.type === 'spell')
    .reduce((acc, card) => {
      acc += card.qty;
      return acc;
    }, 0);
  const warriorsNmb = cards
    .filter((card) => card.type === 'warrior')
    .reduce((acc, card) => {
      acc += card.qty;
      return acc;
    }, 0);

  const cardCost = cards
    .reduce((acc, card) => {
      acc += card.cost;
      return acc;
    }, 0);
  const avarageCardCost = cards.length > 0 ? (cardCost / cards.length).toFixed(1) : 0;
  return {
    cardsNmb, spellsNmb, warriorsNmb, avarageCardCost,
  };
};
