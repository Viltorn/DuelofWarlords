import changeAttackToRedirectCard from './changeAttackToRedirectCard';
import isCellEmpty from './isCellEmpty';
import isInvisible from './isInvisible';

const findCellsInRowForAttack = (data) => {
  const {
    fieldCards, fieldCells, attackingLines, row, card,
  } = data;
  return fieldCells
    .filter((cell) => cell.row === row && !isInvisible(cell, fieldCards)
      && attackingLines.includes(cell.line) && !cell.disabled && !isCellEmpty(fieldCards, cell.id))
    .map((cell) => changeAttackToRedirectCard(cell, card, fieldCells, fieldCards));
};

export default findCellsInRowForAttack;
