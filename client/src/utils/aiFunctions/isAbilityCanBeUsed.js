import getEnemyPlayer from '../supportFunc/getEnemyPlayer';
import getInvokeFeatureData from '../supportFunc/getInvokeFeatureData';

const isAbilityCanBeUsed = (
  ability,
  castingPlayer,
  fieldCards,
  fieldCells,
  warHasSpecialFeature,
) => {
  const { name, aim, type } = ability;
  const rightPlayer = type === 'good' ? castingPlayer : getEnemyPlayer(castingPlayer);
  const invokeFeature = getInvokeFeatureData(ability);
  const warCards = fieldCards.filter((card) => card.type === 'warrior' && card.status === 'field');
  if ((name === 'attack' && !aim.includes('hero')) || (invokeFeature?.features[0].name === 'attack')) {
    return warCards.find((card) => card.player === rightPlayer);
  }
  if ((name === 'heal' && !aim.includes('hero')) || (invokeFeature?.features[0].name === 'heal')) {
    return warCards.find((card) => card.player === rightPlayer);
  }
  if (name === 'power' || (invokeFeature?.features[0].name === 'power')) {
    return warCards.find((card) => card.player === rightPlayer && card.turn === 0
    && !warHasSpecialFeature({
      warCard: card, fieldCards, fieldCells, featureName: 'unarmed',
    }));
  }
  return true;
};

export default isAbilityCanBeUsed;
