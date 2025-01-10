export const addPlayerToCard = (card, player) => {
  const newCard = { ...card };
  newCard.player = player;
  newCard.features = newCard.features.map((feat) => {
    const newFeat = { ...feat };
    newFeat.player = player;
    if (newFeat.name === 'invoke') {
      newFeat.value = addPlayerToCard(newFeat.value, player);
    }
    return newFeat;
  });
  return newCard;
};

const makeDeckForPlayer = (deck, player) => {
  const newDeck = deck.map((card) => {
    const newCard = { ...addPlayerToCard(card, player) };
    return newCard;
  });
  return newDeck;
};

export default makeDeckForPlayer;
