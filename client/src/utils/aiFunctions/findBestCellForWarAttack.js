import isKilled from '../supportFunc/isKilled';
import getProtectionVal from '../supportFunc/getProtectionVal';
import getRandomFromArray from '../getRandomFromArray';

const findTargetCellForWarAttack = ({
  warCard, cellForAttackIds, fieldCards, fieldCells, enemyPoints, findSpells, getWarriorPower,
}) => {
  if (cellForAttackIds.length === 0) return null;
  if (cellForAttackIds.length === 1) return cellForAttackIds[0];

  const warPower = getWarriorPower(warCard);
  const cellWithWarCanBeKilled = cellForAttackIds.find((cellId) => {
    const warInCell = fieldCards.find((card) => card.cellId === cellId && (card.type === 'warrior' || card.type === ' hero'));
    const protectSpells = findSpells({
      attackingCard: warCard,
      defendingCard: warInCell,
      type: 'warrior',
      spell: 'protection',
      allFieldCells: fieldCells,
      allFieldCards: fieldCards,
      spellOwnerPoints: enemyPoints,
    }).filter((spell) => spell.subtype !== 'reaction');
    const protectionVal = protectSpells.length > 0
      ? getProtectionVal(protectSpells, warPower, warInCell.currentHP) : 0;
    const calculatedPower = warPower - protectionVal > 0 ? warPower - protectionVal : 0;
    return isKilled(calculatedPower, warInCell.currentHP);
  });
  if (cellWithWarCanBeKilled) return cellWithWarCanBeKilled;
  return getRandomFromArray(cellForAttackIds);
};

export default findTargetCellForWarAttack;
