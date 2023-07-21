const makeDeckForPLayer = (deck, player) => {
  const newDeck = deck.map((card) => {
    card.player = player;
    return card;
  });
  return newDeck;
};

export default makeDeckForPLayer;
