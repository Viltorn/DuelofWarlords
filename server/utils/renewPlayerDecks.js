const renewPlayerDecks = (deck, decks) => {
  const newDecks = decks.map((item) => {
    if (item.deckName === deck.deckName) {
      return deck;
    }
    return item;
  });
  return newDecks;
};

export default renewPlayerDecks;
