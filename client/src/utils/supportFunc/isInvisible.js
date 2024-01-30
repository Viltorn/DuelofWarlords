export default (cell, fieldCards) => {
  const cellInvis = cell.attachments?.find((feat) => feat.name === 'invisible');
  const warrior = fieldCards.find((card) => card.type === 'warrior' && card.cellId === cell.id);
  const cardInvis = warrior?.attachments.find((feat) => feat.name === 'invisible');
  const featureInvis = warrior?.features.find((feat) => feat.name === 'invisible');
  return cardInvis || cellInvis || featureInvis;
};
