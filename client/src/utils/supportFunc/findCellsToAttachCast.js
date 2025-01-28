import { spellsCells } from '../../gameData/heroes&spellsCellsData';
import isRightPlayerCellForSpell from './isRightPlayerCellForSpell';
import findAdjasentCells from './findAdjasentCells';

const findCellsToAttachCast = (data) => {
  const {
    currentFieldCells, feature, castingPlayer, aimCell,
  } = data;
  const { type, attach } = feature;
  if (attach.includes('cards')) return null;
  if (attach.includes('spells')) {
    return currentFieldCells.filter((cell) => spellsCells.includes(cell.type));
  }
  if (attach.includes('field') && type === 'all') {
    return currentFieldCells.filter((cell) => (cell.type === 'field' && attach.includes('warrior'))
      || (cell.type === 'hero' && attach.includes('hero')));
  } if (attach.includes('field') && type !== 'all') {
    return currentFieldCells.filter((cell) => isRightPlayerCellForSpell(cell, castingPlayer, type) && ((cell.type === 'field' && attach.includes('warrior'))
      || (cell.type === 'hero' && attach.includes('hero'))));
  } if (attach.includes('row') && type === 'all') {
    return currentFieldCells.filter((cell) => cell.row === aimCell.row);
  } if (attach.includes('row') && type !== 'all') {
    return currentFieldCells
      .filter((cell) => cell.row === aimCell.row
      && isRightPlayerCellForSpell(cell, castingPlayer, type));
  }
  if (attach.includes('adjacent') && type === 'all') {
    return findAdjasentCells(currentFieldCells, aimCell);
  } if (attach.includes('adjacent') && type !== 'all') {
    const adjacentCells = findAdjasentCells(currentFieldCells, aimCell);
    return adjacentCells.filter((cell) => isRightPlayerCellForSpell(cell, castingPlayer, type));
  } if (attach.includes('nextcells')) {
    const adjacentCells = findAdjasentCells(currentFieldCells, aimCell);
    return adjacentCells.filter((cell) => cell.line === aimCell.line);
  } if (attach.includes('grave')) {
    return currentFieldCells.filter((cell) => cell.type === 'graveyard' && cell.player === aimCell.player);
  } if (attach.includes('line')) {
    return currentFieldCells
      .filter((cell) => cell.line === aimCell.id);
  }
  return null;
};

export default findCellsToAttachCast;
