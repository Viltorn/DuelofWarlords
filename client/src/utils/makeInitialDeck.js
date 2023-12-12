import _ from 'lodash';
import cardsData from '../gameCardsData/index';

export default (deck) => deck.flatMap(({
  faction, school, name, qty,
}) => {
  const arr = Array(qty).fill({});
  const cards = arr.map(() => {
    const card = faction ? cardsData[faction][name] : cardsData[school][name];
    const uniqCard = { ...card, id: _.uniqueId() };
    uniqCard.features = uniqCard.features.map((feat) => {
      const newFeat = { ...feat, id: uniqCard.id };
      if (feat.name === 'invoke') {
        const newValueFeatures = feat.value.features
          .map((spell) => ({ ...spell, id: _.uniqueId() }));
        const newValue = { ...feat.value, features: newValueFeatures };
        return { ...newFeat, value: newValue };
      }
      return newFeat;
    });
    return uniqCard;
  });
  return cards;
});
