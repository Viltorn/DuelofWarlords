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
  return { cardsNmb, spellsNmb, warriorsNmb };
};
