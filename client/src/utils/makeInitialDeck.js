import _ from 'lodash';
import cardsData from '../gameCardsData/index';

export default (deck, player) => deck.flatMap(({
  faction, school, name, qty,
}) => {
  const arr = Array(qty).fill({});
  const cards = arr.map(() => {
    const card = faction ? cardsData[faction][name] : cardsData[school][name];
    const uniqCard = { ...card, id: _.uniqueId(`${player}_`), status: 'deck' };
    uniqCard.features = uniqCard.features.map((feat) => {
      const newFeat = { ...feat, id: uniqCard.id };
      if (feat.name === 'invoke') {
        const newValueFeatures = feat.value.features
          .map((spell) => ({ ...spell, id: _.uniqueId(`${player}_`), ownerId: uniqCard.id }));
        const newValue = { ...feat.value, features: newValueFeatures, ownerId: uniqCard.id };
        return { ...newFeat, value: newValue };
      }
      return newFeat;
    });
    return uniqCard;
  });
  return cards;
});
