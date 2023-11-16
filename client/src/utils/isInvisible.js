export default (cell) => {
  const cellInvis = cell.attachments?.find((feat) => feat.name === 'invisible');
  const warrior = cell.content.find((item) => item.type === 'warrior');
  const cardInvis = warrior?.attachments.find((feat) => feat.name === 'invisible');
  const featureInvis = warrior?.features.find((feat) => feat.name === 'invisible');
  return cardInvis || cellInvis || featureInvis;
};
