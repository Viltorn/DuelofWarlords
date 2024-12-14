import findAdjasentCells from './findAdjasentCells';
import isRightPlayerCellForSpell from './isRightPlayerCellForSpell';

const findCardsToAttachCast = (data) => {
  const {
    currentFieldCards, feature, castingPlayer, aimCell, currentFieldCells,
  } = data;
  const { type, attach } = feature;
  if (!attach.includes('cards')) return null;
  if (attach.includes('field') && type === 'all') {
    return currentFieldCards.filter((card) => card.type === 'warrior');
  }
  if (attach.includes('field') && type !== 'all') {
    return currentFieldCards.filter((card) => card.type === 'warrior' && isRightPlayerCellForSpell(card, castingPlayer, type));
  } if (attach.includes('row') && type === 'all') {
    return currentFieldCards.filter((card) => card.cellId.split('.')[0] === aimCell.row && card.type === 'warrior');
  } if (attach.includes('row') && type !== 'all') {
    const cards = currentFieldCards
      .filter((card) => card.cellId.split('.')[0] === aimCell.row && card.type === 'warrior' && isRightPlayerCellForSpell(card, castingPlayer, type));
    console.log(cards);
    return cards;
  } if (attach.includes('adjacent')) {
    if (type === 'good') {
      const adjacentCellsIds = findAdjasentCells(currentFieldCells, aimCell).map((cell) => cell.id);
      return currentFieldCards
        .filter((card) => card.player === castingPlayer && adjacentCellsIds.includes(card.cellId));
    }
  } else if (attach.includes('nextcells')) {
    const nexCellsIds = findAdjasentCells(currentFieldCells, aimCell)
      .filter((cell) => cell.line === aimCell.line)
      .map((cell) => cell.id);
    return currentFieldCards.filter((card) => nexCellsIds.includes(card.cellId));
  } else if (attach.includes('line')) {
    if (type === 'good') {
      return currentFieldCards
        .filter((card) => card.cellId.split('.')[1] === aimCell.line && card.player === castingPlayer);
    }
  }
  return null;
};

export default findCardsToAttachCast;
