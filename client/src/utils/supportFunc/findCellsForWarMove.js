import isCellEmpty from './isCellEmpty';

const findCellsForWarMove = (data) => {
  const {
    activeCard, player, fieldCards, fieldCells,
  } = data;
  if (activeCard.subtype === 'fighter') {
    return fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id) && cell.player === player
      && !cell.disabled && cell.type === 'field');
    // (cell.line === '1' || cell.line === '3')
  }
  if (activeCard.subtype === 'shooter') {
    return fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id) && cell.player === player
     && !cell.disabled && cell.type === 'field');
  }
  if (activeCard.subtype === 'flyer') {
    return fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id)
    && cell.player === player && !cell.disabled && cell.type === 'field');
  }
  return [];
};

export default findCellsForWarMove;
