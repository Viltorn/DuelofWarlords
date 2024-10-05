import { spellsCells } from '../../gameData/heroes&spellsCellsData';
import findAdjasentCells from './findAdjasentCells';

const findCellsToAttachCast = (data) => {
  const {
    currentFieldCells, feature, castingPlayer, enemyPlayer, aimCell,
  } = data;
  const { type, attach } = feature;
  if (attach.includes('cards')) return null;
  if (attach.includes('spells')) {
    return currentFieldCells.filter((cell) => spellsCells.includes(cell.type));
  }
  if (attach.includes('field') && type === 'all') {
    return currentFieldCells.filter((cell) => (cell.type === 'field' && attach.includes('warrior'))
      || (cell.type === 'hero' && attach.includes('hero')));
  } if (attach.includes('field') && type === 'good') {
    return currentFieldCells.filter((cell) => cell.player === castingPlayer && ((cell.type === 'field' && attach.includes('warrior'))
      || (cell.type === 'hero' && attach.includes('hero'))));
  } if (attach.includes('field') && type === 'bad') {
    return currentFieldCells.filter((cell) => cell.player === enemyPlayer && ((cell.type === 'field' && attach.includes('warrior'))
    || (cell.type === 'hero' && attach.includes('hero'))));
  } if (attach.includes('row')) {
    if (type === 'all') {
      return currentFieldCells.filter((cell) => cell.row === aimCell.row);
    }
    if (type === 'bad') {
      return currentFieldCells
        .filter((cell) => cell.row === aimCell.row && cell.player === enemyPlayer);
    }
    if (type === 'good') {
      return currentFieldCells
        .filter((cell) => cell.row === aimCell.row && cell.player === castingPlayer);
    }
  } else if (attach.includes('adjacent')) {
    if (type === 'good') {
      const adjacentCells = findAdjasentCells(currentFieldCells, aimCell);
      return adjacentCells.filter((cell) => cell.player === castingPlayer);
    }
  } else if (attach.includes('nextcells')) {
    const adjacentCells = findAdjasentCells(currentFieldCells, aimCell);
    return adjacentCells.filter((cell) => cell.line === aimCell.line);
  } else if (attach.includes('grave')) {
    if (type === 'good') return currentFieldCells.filter((cell) => cell.type === 'graveyard' && cell.player === castingPlayer);
    if (type === 'bad') return currentFieldCells.filter((cell) => cell.type === 'graveyard' && cell.player === enemyPlayer);
  } else if (attach.includes('line')) {
    if (type === 'good') {
      return currentFieldCells
        .filter((cell) => cell.line === aimCell.id && cell.player === castingPlayer);
    }
  }
  return null;
};

export default findCellsToAttachCast;
