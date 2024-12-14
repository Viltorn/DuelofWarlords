const sortFunc = (a, b) => a.cost - b.cost;

export default (cards) => {
  const warriorCards = cards.filter((card) => card.type === 'warrior');
  const spellCards = cards.filter((card) => card.type === 'spell');
  return [...warriorCards.sort(sortFunc), ...spellCards.sort(sortFunc)];
};
