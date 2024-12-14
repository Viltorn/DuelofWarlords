export default ({ cardsCell, feature }) => {
  if (!feature.attachCondition) {
    return true;
  }
  if (feature.attachCondition === 'cardInFrontLine') {
    return cardsCell.line === '1' || cardsCell.line === '3';
  }
  return true;
};
