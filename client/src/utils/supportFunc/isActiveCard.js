export default (card) => (card.type === 'warrior' || card.type === 'hero' ? card.turn === 0 : true);
