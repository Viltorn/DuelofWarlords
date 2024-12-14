const addPlayerToCard = (card, player) => {
  const newCard = { ...card };
  newCard.player = player;
  newCard.features = newCard.features.map((feat) => {
    feat.player = player;
    if (feat.name === 'invoke') {
      feat.value = addPlayerToCard(feat.value, player);
    }
    return feat;
  });
  return newCard;
};

const makeDeckForPLayer = (deck, player) => {
  const newDeck = deck.map((card) => {
    const newCard = addPlayerToCard(card, player);
    return newCard;
  });
  return newDeck;
};

export default makeDeckForPLayer;
