/* eslint-disable max-len */
import getEnemyPlayer from './getEnemyPlayer';
import { spellsCells } from '../../gameData/heroes&spellsCellsData';
import isCellEmpty from './isCellEmpty';

const findCellsForSpellCast = (data) => {
  const {
    feature, player, place, fieldCards, fieldCells, spellCard,
  } = data;
  const {
    type, attach, aim, ownerId,
  } = feature;

  const aimPlayer = type === 'good' ? player : getEnemyPlayer(player);

  if (aim.includes('emptyRowField') && place === '') {
    return fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id)
    && cell.player === aimPlayer && !cell.disabled && cell.type === 'field' && cell.row === spellCard.cellId[0]);
  }

  if (type !== 'all' && place === '') {
    const cellsToapply = fieldCells.filter((cell) => {
      const rightSubtype = fieldCards
        .find((card) => aim.includes(card.subtype) && card.cellId === cell.id && ownerId !== card.id);
      return rightSubtype && !isCellEmpty(fieldCards, cell.id) && cell.player === aimPlayer && !cell.disabled && (cell.type === 'field' || cell.type === 'hero');
    });
    console.log(cellsToapply);
    return cellsToapply;
  }
  if (type === 'all' && place === '') {
    return fieldCells.filter((cell) => {
      const rightSubtype = fieldCards
        .find((card) => aim.includes(card.subtype) && card.cellId === cell.id && ownerId !== card.id);
      return !isCellEmpty(fieldCards, cell.id) && !cell.disabled && rightSubtype && (cell.type === 'field' || cell.type === 'hero');
    });
  }
  if (place === 'warrior' && type !== 'all') {
    const warriorCells = attach.includes('warrior') ? fieldCells.filter((cell) => {
      // const cardsInCell = fieldCards.filter((card) => card.cellId === cell.id).length;
      const warriorInCell = fieldCards
        .find((card) => card.cellId === cell.id && attach.includes(card.subtype) && ownerId !== card.id);
      // const isPlayerOccupiedCell = cardsInCell > 0;
      return !cell.disabled && cell.player === aimPlayer && cell.type === 'field' && warriorInCell;
    }) : [];
    const heroCells = attach.includes('hero') ? fieldCells.filter((cell) => !cell.disabled && cell.player === aimPlayer && cell.type === 'hero')
      : [];
    console.log([...warriorCells, ...heroCells]);
    return [...warriorCells, ...heroCells];
  }
  if (place === 'warrior' && type === 'all') {
    return fieldCells.filter((cell) => {
      // const cardsInCell = fieldCards.filter((card) => card.cellId === cell.id).length;
      const warriorInCell = fieldCards
        .find((card) => card.cellId === cell.id && attach.includes(card.subtype) && ownerId !== card.id);
      // const isPlayerOccupiedCell = cardsInCell > 0;
      return !cell.disabled && cell.type === 'field' && warriorInCell;
    });
  }

  if (place === 'spell' && type !== 'all') {
    const cells = fieldCells.filter((cell) => {
      const spellInCell = fieldCards
        .find((card) => card.cellId === cell.id && card.type === 'spell');
      return spellsCells.includes(cell.type) && spellInCell
        && (cell.player === aimPlayer || !cell.player) && !cell.disabled;
    });
    console.log(cells);
    return cells;
  }

  if (place === 'spell' && type === 'all') {
    return fieldCells.filter((cell) => {
      const spellInCell = fieldCards
        .find((card) => card.cellId === cell.id && card.type === 'spell');
      return spellsCells.includes(cell.type) && spellInCell && !cell.disabled;
    });
  }

  if (place === 'topSpell') {
    return fieldCells.filter((cell) => place === cell.type && cell.player === aimPlayer
      && isCellEmpty(fieldCards, cell.id) && !cell.disabled);
  }
  if (place === 'graveyard' && type === 'all') {
    return fieldCells.filter((cell) => place === cell.type && !cell.disabled);
  }
  if (place === 'graveyard' && type !== 'all') {
    return fieldCells.filter((cell) => place === cell.type && cell.player === aimPlayer
    && !cell.disabled);
  }
  return fieldCells.filter((cell) => place === cell.type
    && (isCellEmpty(fieldCards, cell.id) || place === 'bigSpell') && !cell.disabled);
};

export default findCellsForSpellCast;
