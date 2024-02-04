import getEnemyPlayer from './getEnemyPlayer';
import isCellEmpty from './isCellEmpty';

const findCellsForSpellCast = (data) => {
  const {
    feature, player, place, fieldCards, fieldCells,
  } = data;
  const { type, attach, aim } = feature;

  const aimPlayer = type === 'good' ? player : getEnemyPlayer(player);

  if (type !== 'all' && place === '') {
    return fieldCells.filter((cell) => !isCellEmpty(fieldCards, cell.id)
    && cell.player === aimPlayer && !cell.disabled && cell.type === 'field');
  }
  if (type === 'all' && place === '') {
    return fieldCells.filter((cell) => {
      const rightSubtype = fieldCards
        .find((card) => aim.includes(card.subtype) && card.cellId === cell.id);
      return !isCellEmpty(fieldCards, cell.id) && !cell.disabled && rightSubtype && cell.type === 'field';
    });
  }
  if (place === 'warrior' && attach.includes('warrior') && type !== 'all') {
    return fieldCells.filter((cell) => {
      const cardsInCell = fieldCards.filter((card) => card.cellId === cell.id).length;
      const isPlayerOccupiedCell = cardsInCell > 0 && cardsInCell < 3;
      return isPlayerOccupiedCell && !cell.disabled && cell.player === aimPlayer && cell.type === 'field';
    });
  }
  if (place === 'warrior' && attach.includes('warrior') && type === 'all') {
    return fieldCells.filter((cell) => {
      const cardsInCell = fieldCards.filter((card) => card.cellId === cell.id).length;
      const isPlayerOccupiedCell = cardsInCell > 0 && cardsInCell < 3;
      return isPlayerOccupiedCell && !cell.disabled && cell.type === 'field';
    });
  }

  if (place === 'warrior' && attach.includes('hero')) {
    return fieldCells.filter((cell) => !cell.disabled && cell.player === aimPlayer && cell.type === 'hero');
  }

  if (place !== 'postponed') {
    return fieldCells.filter((cell) => place === cell.type
    && (isCellEmpty(fieldCards, cell.id) || place === 'bigSpell') && !cell.disabled);
  }
  return [];
};

export default findCellsForSpellCast;
