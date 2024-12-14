import findCellsForMassAttack from './findCellsForMassAttack';
import findCellsInRowForAttack from './findCellsInRowForAttack';

const findCellsForWarAttack = (card, fieldCards, fieldCells) => {
  const { cellId } = card;
  const cellArr = cellId.split('.');
  const row = cellArr[0];
  const line = cellArr[1];
  const attackingLines = line <= 2 ? ['3', '4'] : ['1', '2'];
  const attackingRowCells = findCellsInRowForAttack({
    fieldCards, fieldCells, attackingLines, row, card,
  });
  console.log(attackingRowCells);
  const warCell = fieldCells.find((cell) => cell.id === cellId);
  const hasMassAttack = card.features.find((feat) => feat.name === 'massAttack') || card.attachments.find((feat) => feat.name === 'massAttack')
  || warCell.attachments.find((feat) => feat.name === 'massAttack');
  const attackingCells = !hasMassAttack
    ? attackingRowCells : findCellsForMassAttack({
      fieldCards, fieldCells, attackingLines, card,
    });
  const attackingHeroCell = fieldCells.find((cell) => cell.type === 'hero' && cell.player !== card.player);
  const finalCellsForAttack = [];

  if (card.subtype === 'shooter' || card.subtype === 'flyer') {
    if (attackingCells.length !== 0) {
      finalCellsForAttack.push(...attackingCells);
    }
    if (attackingRowCells.length === 0 && !attackingHeroCell.disabled) {
      finalCellsForAttack.push(attackingHeroCell);
    }
  }
  if (card.subtype === 'fighter') {
    if (attackingCells.length > 1 && !hasMassAttack) {
      const attackCell = attackingCells.find((cell) => attackingLines[0] === cell.line);
      finalCellsForAttack.push(attackCell);
    } else if (attackingCells.length === 1 || hasMassAttack) {
      finalCellsForAttack.push(...attackingCells);
    }
    if (attackingRowCells.length === 0 && !attackingHeroCell.disabled) {
      finalCellsForAttack.push(attackingHeroCell);
    }
  }
  return finalCellsForAttack;
};

export default findCellsForWarAttack;
