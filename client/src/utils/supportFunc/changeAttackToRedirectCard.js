import findCellByContentId from './findCellByContentId';

const changeToRedirect = (checkingCell, card, curFieldCells, curFieldCards) => {
  const redirectSpell = checkingCell.attachments?.find((feat) => feat.name === 'redirectWarAttack');
  const cardType = card.type === 'spell' ? 'spell' : card.subtype;
  if (redirectSpell && redirectSpell.aim.includes(cardType)) {
    return findCellByContentId(redirectSpell.id, curFieldCells, curFieldCards);
  }
  return checkingCell;
};

export default changeToRedirect;
