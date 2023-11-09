const makeDeckForPLayer = (deck, player) => {
  const newDeck = deck.map((card) => {
    const newCardcard = { ...card };
    newCardcard.player = player;
    return newCardcard;
  });
  return newDeck;
};

export default makeDeckForPLayer;
