const findAimCard = (feature, cardsInCell) => cardsInCell
  .find((card) => feature.aim.includes(card.type));

export default findAimCard;
