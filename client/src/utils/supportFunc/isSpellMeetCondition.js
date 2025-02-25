import warSubtypes from '../../gameData/warriorsSubtypes.js';
import findAdjasentCells from './findAdjasentCells.js';
import isCellEmpty from './isCellEmpty.js';

const isSpellMeetCondition = (data) => {
  const {
    attackingCard,
    defendingCard,
    spell,
    type,
    allFieldCells,
    attackingPower,
    allFieldCards,
    spellOwnerPoints,
  } = data;
  const { condition, conditionValue, cost } = spell;
  if (cost && spellOwnerPoints && spellOwnerPoints - cost < 0) return false;
  if (!condition && !defendingCard) {
    return true;
  }
  if (type === 'warrior' || warSubtypes.includes(type)) {
    if (condition === 'minPower') {
      const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
      const attackingAddPower = attackingPowerFeature?.value || 0;
      return (attackingPower + attackingAddPower) >= conditionValue;
    }
    if (condition === 'maxPower') {
      const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
      const attackingAddPower = attackingPowerFeature?.value || 0;
      return (attackingPower + attackingAddPower) <= conditionValue;
    }
    if (condition === 'canDie') {
      const power = attackingCard.type === 'warrior' ? attackingPower : attackingCard.value;
      const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
      const attackingAddPower = attackingPowerFeature?.value || 0;
      const currentHP = defendingCard?.currentHP;
      return currentHP - (power + attackingAddPower) <= 0;
    }
    if (condition === 'nextRowCell') {
      const protectCell = allFieldCells.find((cell) => cell.id === defendingCard?.cellId);
      const curRowNumber = parseInt(protectCell.row, 10);
      const currentline = protectCell.line;
      const topRowNumber = (curRowNumber - 1).toString();
      const bottomRowNumber = (curRowNumber + 1).toString();
      const topRowCell = allFieldCells.find((cell) => cell.row === topRowNumber
          && cell.line === currentline && isCellEmpty(allFieldCards, cell.id));
      const bottomRowCell = allFieldCells.find((cell) => cell.row === bottomRowNumber
          && cell.line === currentline && isCellEmpty(allFieldCards, cell.id));
      return (topRowCell || bottomRowCell) && defendingCard.turn !== 2;
    }
    if (condition === 'noAdjasentAlly') {
      const curCell = allFieldCells.find((cell) => cell.id === attackingCard.cellId);
      const adjasentAllyCells = findAdjasentCells(allFieldCells, curCell)
        .filter((cell) => cell.player === attackingCard.player);
      const cellWithWar = adjasentAllyCells.find((cell) => !isCellEmpty(allFieldCards, cell.id));
      return !cellWithWar;
    }
  }
  return true;
};

export default isSpellMeetCondition;
