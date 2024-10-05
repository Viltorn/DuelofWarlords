const isAllowedCost = (checkCard, currentPoints) => {
  const newPoints = currentPoints - checkCard.currentC;
  const fieldCard = checkCard.status !== 'hand' && checkCard.type !== 'hero';
  if (((checkCard.status === 'hand' || checkCard.type === 'hero') && newPoints >= 0) || fieldCard || checkCard.subtype === 'reaction') {
    return true;
  }
  return false;
};

export default isAllowedCost;
