const findActiveWarCard = (curFieldCells, player) => curFieldCells
  .filter((cell) => cell.type === 'field' && cell.player === player && cell.content !== 0)
  .find((cell) => cell.content.find((item) => item.type === 'warrior' && item.turn === 0));

export default findActiveWarCard;
