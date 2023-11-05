export default (deck) => deck.flatMap(({ card, qty }) => {
  const arr = Array(qty);
  return arr.fill(card);
});
