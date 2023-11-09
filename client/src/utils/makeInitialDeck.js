import _ from 'lodash';

export default (deck) => deck.flatMap(({ card, qty }) => {
  const arr = Array(qty).fill({});
  const cards = arr.map(() => {
    const newCard = { ...card, id: _.uniqueId() };
    newCard.features = newCard.features.map((feat) => {
      const newFeat = { ...feat, id: newCard.id };
      if (feat.name === 'invoke') {
        const newValueFeatures = feat.value.features
          .map((spell) => ({ ...spell, id: _.uniqueId() }));
        const newValue = { ...feat.value, features: newValueFeatures };
        return { ...newFeat, value: newValue };
      }
      return newFeat;
    });
    return newCard;
  });
  return cards;
});
