import findAdjasentCells from './findAdjasentCells';

const findCardsToAttachCast = (data) => {
  const {
    currentFieldCards, feature, castingPlayer, enemyPlayer, aimCell, currentFieldCells,
  } = data;
  const { type, attach } = feature;
  if (!attach.includes('cards')) return null;
  if (attach.includes('field') && type === 'all') {
    return currentFieldCards.filter((card) => card.type === 'warrior' && card.attachments.length < 2);
  }
  if (attach.includes('field') && type === 'good') {
    return currentFieldCards.filter((card) => card.type === 'warrior' && card.attachments.length < 2 && card.player === castingPlayer);
  } if (attach.includes('field') && type === 'bad') {
    return currentFieldCards.filter((card) => card.type === 'warrior' && card.attachments.length < 2 && card.player === enemyPlayer);
  } if (attach.includes('row')) {
    if (type === 'all') {
      return currentFieldCards.filter((card) => card.cellId.split('.')[0] === aimCell.row);
    }
    if (type === 'bad') {
      return currentFieldCards
        .filter((card) => card.cellId.split('.')[0] === aimCell.row && card.player === enemyPlayer);
    }
    if (type === 'good') {
      return currentFieldCards
        .filter((card) => card.cellId.split('.')[0] === aimCell.row && card.player === castingPlayer);
    }
  } else if (attach.includes('adjacent')) {
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
