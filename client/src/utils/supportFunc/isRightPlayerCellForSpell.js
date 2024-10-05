export default (cell, castingPlayer, type) => {
  if (type === 'good') return cell.player === castingPlayer;
  if (type === 'bad') return cell.player !== castingPlayer;
  return true;
};
