import warSubtypes from '../../gameData/warriorsSubtypes.js';

const isSpellMeetCondition = (data) => {
  const {
    attackingCard, defendingCard, spell, type, allFieldCells, attackingPower,
  } = data;
  const { condition, conditionValue } = spell;
  if (type === 'warrior' || warSubtypes.includes(type)) {
    if (condition && condition === 'minPower') {
      const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
      const attackingAddPower = attackingPowerFeature?.value || 0;
      return (attackingPower + attackingAddPower) >= conditionValue;
    }
    if (condition && condition === 'maxPower') {
      const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
      const attackingAddPower = attackingPowerFeature?.value || 0;
      return (attackingPower + attackingAddPower) <= conditionValue;
    }
    if (condition && condition === 'canDie') {
      const power = attackingCard.type === 'warrior' ? attackingPower : attackingCard.value;
      const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
      const attackingAddPower = attackingPowerFeature?.value || 0;
      const { currentHP } = defendingCard;
      return currentHP - (power + attackingAddPower) <= 0;
    }
    if (condition && condition === 'nextRowCell') {
      const protectCell = allFieldCells.find((cell) => cell.id === defendingCard.cellId);
      const curRowNumber = parseInt(protectCell.row, 10);
      const currentline = protectCell.line;
      const topRowNumber = (curRowNumber - 1).toString();
      const bottomRowNumber = (curRowNumber + 1).toString();
      const topRowCell = allFieldCells.find((cell) => cell.row === topRowNumber
          && cell.line === currentline && cell.content.length === 0);
      const bottomRowCell = allFieldCells.find((cell) => cell.row === bottomRowNumber
          && cell.line === currentline && cell.content.length === 0);
      return (topRowCell || bottomRowCell) && defendingCard.turn !== 2;
    }
  }
  return true;
};

export default isSpellMeetCondition;
