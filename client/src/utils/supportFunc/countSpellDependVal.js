/* eslint-disable max-len */
import findAdjasentCells from './findAdjasentCells';
import isCellEmpty from './isCellEmpty';

const countSpellDependVal = ({
  spell, aimCardPower, currentFieldCards, currentFieldCells, lastPlayedCard, playerPoints, appliedCard,
}) => {
  const {
    depend, dependValue, value, id, player, school,
  } = spell;
  if (!depend) {
    return value;
  }
  if (depend === 'goodAttachments') {
    const goodAttach = currentFieldCards.filter((card) => card.type === 'spell'
      && card.player === player && card.status === 'field');
    return dependValue * goodAttach.length;
  }
  if (depend === 'adjasentAlly' && appliedCard) {
    const appliedCell = currentFieldCells.find((cell) => cell.id === appliedCard.cellId);
    const adjasentCells = findAdjasentCells(currentFieldCells, appliedCell);
    const adjasentCellWithWars = adjasentCells.filter((cell) => !isCellEmpty(currentFieldCards, cell.id) && cell.player === appliedCard.player);
    return value + dependValue * adjasentCellWithWars.length;
  }
  if (depend === 'warriorsDiff') {
    const goodWarriorsQty = currentFieldCards.filter((card) => card.type === 'warrior'
      && card.player === player && card.status === 'field').length;
    const enemyPlayer = player === 'player1' ? 'player2' : 'player1';
    const badWarriorsQty = currentFieldCards.filter((card) => card.type === 'warrior'
      && card.player === enemyPlayer && card.status === 'field').length;
    const diff = (badWarriorsQty - goodWarriorsQty) > 0 ? badWarriorsQty - goodWarriorsQty : 0;
    return value + (dependValue * diff);
  }
  if (depend === 'enemiPoinstAndWarriorsDiff') {
    const goodWarriorsQty = currentFieldCards.filter((card) => card.type === 'warrior'
    && card.player === player && card.status === 'field').length;
    const enemyPlayer = player === 'player1' ? 'player2' : 'player1';
    const enemyPoints = playerPoints.find((item) => item.player === enemyPlayer).points;
    const diff = enemyPoints - goodWarriorsQty > 0 ? enemyPoints - goodWarriorsQty : 0;
    return diff;
  }
  if (depend === 'postponed') {
    const cardWithFeature = currentFieldCards.find((card) => card.id === id);
    const cellId = cardWithFeature?.cellId;
    if (cellId === 'postponed1' || cellId === 'postponed2') {
      return dependValue;
    }
  }
  if (depend === 'attackerPower') {
    return aimCardPower;
  }
  if (depend === 'lastPlayedIsSpell') {
    const isLastPlayedCardIsSpell = lastPlayedCard.type === 'spell' && lastPlayedCard.player === player;
    return value + (isLastPlayedCardIsSpell ? dependValue : 0);
  }
  if (depend === 'sameSchoolSpellOnFiled') {
    const isRightSpellOnField = currentFieldCards.find((c) => c.player === player && c.status === 'field' && c.school === school);
    return value + (isRightSpellOnField ? dependValue : 0);
  }
  return value;
};

export default countSpellDependVal;
