import getProtectionVal from '../supportFunc/getProtectionVal';
import isKilled from '../supportFunc/isKilled';
import { midSpells } from '../../gameData/heroes&spellsCellsData';
import isWarInRow from './isWarInRow';
import getEnemyPlayer from '../supportFunc/getEnemyPlayer';

const isWarNeedToMove = ({
  warCard, findSpells, fieldCards, fieldCells, enemyPoints, getWarriorPower,
}) => {
  const enemyPlayer = getEnemyPlayer(warCard.player);
  const findAiHero = fieldCards.find((c) => c.player === warCard.player && c.type === 'hero');
  const aiHeroHP = findAiHero.currentHP;
  const enemyHero = fieldCards.find((c) => c.player !== warCard.player && c.type === 'hero');
  const enemyHeroHP = enemyHero.currentHP;
  const warPower = getWarriorPower(warCard);
  const protectSpells = findSpells({
    attackingCard: warCard,
    defendingCard: enemyHero,
    type: 'warrior',
    spell: 'protection',
    allFieldCells: fieldCells,
    allFieldCards: fieldCards,
    spellOwnerPoints: enemyPoints,
  }).filter((spell) => spell.subtype !== 'reaction');
  const protectionVal = protectSpells.length > 0
    ? getProtectionVal(protectSpells, warPower, enemyHeroHP) : 0;
  const calculatedPower = warPower - protectionVal > 0 ? warPower - protectionVal : 0;
  const isHeroCanBeKilled = isKilled(calculatedPower, enemyHeroHP);
  const rowIds = midSpells.map((cell) => cell.row);
  const unprotectedRows = rowIds.filter((rowId) => {
    const enemyWar = isWarInRow(rowId, fieldCards, enemyPlayer);
    const allyWar = isWarInRow(rowId, fieldCards, warCard.player);
    return enemyWar && !allyWar;
  });

  const warRowHasNoEnemy = !isWarInRow(warCard.cellId[0], fieldCards, enemyPlayer);
  if (isHeroCanBeKilled) {
    return false;
  }
  if (unprotectedRows.length > 0 && warRowHasNoEnemy && aiHeroHP < 10) {
    console.log('war need to move!');
    return true;
  }
  return false;
};

export default isWarNeedToMove;
