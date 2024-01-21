import changeAttackToRedirectCard from './changeAttackToRedirectCard';
import isInvisible from './isInvisible';

const findCellsInRowForAttack = (curFieldCells, attackingLines, row, card) => curFieldCells
  .filter((cell) => cell.row === row && !isInvisible(cell)
  && attackingLines.includes(cell.line) && cell.content.length !== 0 && !cell.disabled)
  .map((cell) => changeAttackToRedirectCard(cell, card, curFieldCells));

export default findCellsInRowForAttack;
