export default (cards) => cards.map((card) => ({
  name: card.description,
  faction: card.faction ?? null,
  school: card.school ?? null,
  type: card.type,
  qty: card.qty,
}));
