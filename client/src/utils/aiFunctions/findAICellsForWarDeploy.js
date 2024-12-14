import isWarInRow from './isWarInRow';

export default (fieldCards, availableCells, card) => {
  const preferableCellsIDsInLine = card.subtype === 'flyer' || card.subtype === 'shooter'
    ? availableCells.filter((cellId) => (cellId[2] === '2' || cellId[2] === '4')) : availableCells.filter((cellId) => (cellId[2] === '1' || cellId[2] === '3'));
  const preferableCellsIDsInRow = card.subtype === 'flyer' || card.subtype === 'shooter' ? preferableCellsIDsInLine.filter((cell) => !isWarInRow(cell[0], fieldCards, 'player1'))
    : preferableCellsIDsInLine.filter((cell) => isWarInRow(cell[0], fieldCards, 'player1'));
  const preferablesCells = preferableCellsIDsInRow.length > 0
    ? preferableCellsIDsInRow : preferableCellsIDsInLine;
  return preferablesCells.length > 0 ? preferablesCells : availableCells;
};
