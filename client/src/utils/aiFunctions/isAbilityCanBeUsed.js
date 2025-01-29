import getEnemyPlayer from '../supportFunc/getEnemyPlayer';
import getInvokeFeatureData from '../supportFunc/getInvokeFeatureData';
import isTwoWarsInRow from './isTwoEnemyiesInRow';
import isWarInRow from './isWarInRow';

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
  if (((name === 'attack' && !aim.includes('hero')) || (invokeFeature?.features[0].name === 'attack')) && aim.includes('emptyRowField')) {
    const castingCard = fieldCards.find((c) => c.id === ability.id);
    if (!castingCard) return false;
    const { cellId } = castingCard;
    return !isTwoWarsInRow(cellId[0], fieldCards, rightPlayer);
  }
  if (name === 'attack' && !aim.includes('hero') && !invokeFeature && (aim.includes('row') || aim.includes('closestEnemyInRow'))) {
    const castingCard = fieldCards.find((c) => c.id === ability.id);
    if (!castingCard) return false;
    const { cellId } = castingCard;
    return isWarInRow(cellId[0], fieldCards, rightPlayer);
  }
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
  if (name === 'moving' || (invokeFeature?.features[0].name === 'moving')) {
    return warCards.find((card) => card.player === rightPlayer);
  }
  return true;
};

export default isAbilityCanBeUsed;
