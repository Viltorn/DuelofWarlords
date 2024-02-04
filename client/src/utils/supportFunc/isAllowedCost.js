const isAllowedCost = (checkCard, currentPoints) => {
  const newCost = currentPoints - checkCard.currentC;
  const fieldCard = checkCard.status !== 'hand' && checkCard.type !== 'hero';
  if (((checkCard.status === 'hand' || checkCard.type === 'hero') && newCost >= 0) || fieldCard) {
    return true;
  }
  return false;
};

export default isAllowedCost;
