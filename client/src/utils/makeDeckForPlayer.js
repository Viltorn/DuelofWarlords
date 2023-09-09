const makeDeckForPLayer = (deck, player) => {
  const newDeck = deck.map((card) => {
    const newCardcard = { ...card };
    newCardcard.features = newCardcard.features.map((feat) => {
      const newFeat = { ...feat };
      newFeat.id = newCardcard.id;
      return newFeat;
    });
    newCardcard.player = player;
    return newCardcard;
  });
  return newDeck;
};

export default makeDeckForPLayer;
