const makeDeckForPLayer = (deck, player) => {
  const newDeck = deck.map((card) => {
    const newCardcard = { ...card };
    newCardcard.player = player;
    newCardcard.features = newCardcard.features.map((feat) => {
      feat.player = player;
      return feat;
    });
    return newCardcard;
  });
  return newDeck;
};

export default makeDeckForPLayer;
