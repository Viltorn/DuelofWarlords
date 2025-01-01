import isCellEmpty from '../supportFunc/isCellEmpty';
import findRowsWithWar from './findRowsWithWar';
import getEnemyPlayer from '../supportFunc/getEnemyPlayer';
import isWarNeedToMove from './isWarNeedToMove';
import calcMaxWarsInLine from './calcMaxWarsInLine';

const isWarEffectivePlay = (card, aiHero, aiCards, fieldCells) => {
  if (card.subtype === 'shooter') {
    const isShooterEffective = fieldCells.find((cell) => isCellEmpty(aiCards, cell.id) && cell.line === '4');
    return isShooterEffective || aiHero.currentHP < 6;
  }
  const isAnyWarEffective = aiCards.length < 6 || aiHero.currentHP < 10;

  return isAnyWarEffective;
};

const isSpellEffectivePlay = ({
  spellCard, fieldCards, fieldCells, enemyPoints, getWarriorPower, findSpells,
}) => {
  const {
    aim, type, attach, name,
  } = spellCard.features[0];
  const { place, player, subtype } = spellCard;
  const rightPlayer = type === 'good' ? spellCard.player : getEnemyPlayer(player);
  const playersWarsOnField = fieldCards.filter((card) => card.type === 'warrior' && card.player === rightPlayer && card.status === 'field');
  if (subtype === 'reaction') {
    return true;
  }
  if (name === 'swift') {
    const warNeedsToMove = playersWarsOnField.find((warCard) => isWarNeedToMove({
      warCard, findSpells, fieldCards, fieldCells, enemyPoints, getWarriorPower,
    }) && warCard.turn === 0);
    return warNeedsToMove;
  }
  if (name === 'moving') {
    const warNeedsToMove = playersWarsOnField.find((warCard) => isWarNeedToMove({
      warCard, findSpells, fieldCards, fieldCells, enemyPoints, getWarriorPower,
    }));
    return warNeedsToMove;
  }
  if (name === 'power') {
    const warCanAttack = playersWarsOnField.find((warCard) => warCard.turn === 0);
    return warCanAttack;
  }
  if (name === 'readiness') {
    const aiHero = fieldCards.find((c) => c.type === 'hero' && c.player === rightPlayer);
    return aiHero.turn !== 0;
  }
  if ((aim.includes('row') || (attach && attach.includes('row'))) && place === 'midSpell') {
    const cellsIds = fieldCells.filter((cell) => cell.type === 'midSpell').map((cell) => cell.id);
    const rowsIdsWithWar = findRowsWithWar(cellsIds, fieldCards, rightPlayer);
    return rowsIdsWithWar.length > 0;
  }
  if (aim.includes('line') || (attach && attach.includes('line'))) {
    const cellsids = fieldCells
      .filter((cell) => cell.player === rightPlayer && cell.type === 'field').map((cell) => cell.id);
    const maxWarsInLine = calcMaxWarsInLine(cellsids, fieldCards);
    return maxWarsInLine > 0;
  }
  if (attach && attach.includes('grave')) {
    return fieldCards.find((card) => card.status === 'graveyard' && card.player === rightPlayer && aim.includes(card.subtype));
  }
  return true;
};

const filterCardsEffectiveToPlay = ({
  cards, fieldCards, fieldCells, enemyPoints, getWarriorPower, findSpells,
}) => {
  const aiHero = fieldCards.find((c) => c.player === 'player2' && c.type === 'hero');
  const aiCardsOnField = fieldCards.filter((c) => c.player === 'player2' && c.status === 'field');
  return cards.filter((c) => {
    if (c.type === 'warrior') {
      return isWarEffectivePlay(c, aiHero, aiCardsOnField, fieldCells);
    }
    if (c.type === 'spell') {
      return isSpellEffectivePlay({
        spellCard: c, fieldCards, fieldCells, enemyPoints, getWarriorPower, findSpells,
      });
    }
    return true;
  });
};

export default filterCardsEffectiveToPlay;
