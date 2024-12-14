const isWarEffectivePlay = (enemyHero, aiCards) => aiCards.length < 6 || enemyHero.currentHP < 6;

export default ({ cards, fieldCards }) => {
  const enemyHero = fieldCards.find((c) => c.player === 'player1' && c.type === 'hero');
  const aiCardsOnField = fieldCards.filter((c) => c.player === 'player2' && c.status === 'field');
  return cards.filter((c) => {
    if (c.type === 'warrior') {
      return isWarEffectivePlay(enemyHero, aiCardsOnField);
    }
    return true;
  });
};
