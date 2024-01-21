import isInvisible from './isInvisible';
import changeAttackToRedirectCard from './changeAttackToRedirectCard';

const findCellsForMassAttack = (curFieldCells, attackingLines, card) => curFieldCells
  .filter((cell) => cell.type === 'field' && !isInvisible(cell) && cell.content.length !== 0
  && attackingLines.includes(cell.line))
  .map((cell) => changeAttackToRedirectCard(cell, card, curFieldCells));

export default findCellsForMassAttack;
