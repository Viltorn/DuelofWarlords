const findCellByContentId = (id, curFieldCells) => curFieldCells
  .find((cell) => cell.content.find((el) => el.id === id));

export default findCellByContentId;
