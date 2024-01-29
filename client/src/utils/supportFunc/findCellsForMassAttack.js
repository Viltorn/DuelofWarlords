import isInvisible from './isInvisible';
import isCellEmpty from './isCellEmpty';
import changeAttackToRedirectCard from './changeAttackToRedirectCard';

const findCellsForMassAttack = (data) => {
  const {
    fieldCards, fieldCells, attackingLines, card,
  } = data;

  return fieldCells
    .filter((cell) => cell.type === 'field' && !isInvisible(cell, card)
    && attackingLines.includes(cell.line) && !cell.disabled && !isCellEmpty(fieldCards, cell.id))
    .map((cell) => changeAttackToRedirectCard(cell, card, fieldCells, fieldCards));
};

export default findCellsForMassAttack;
