const makeShaffledDeck = (deck) => {
  const newDeck = deck;
  deck.forEach((card, index, arr) => {
    const newIndex = Math.floor((Math.random() * (deck.length - index)) + index);
    newDeck[index] = arr[newIndex];
    newDeck[newIndex] = card;
  });
  return newDeck;
};

export default makeShaffledDeck;
