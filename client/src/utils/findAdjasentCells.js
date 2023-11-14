import findAdjasentLine from './findAdjasentLine';

export default (aimCell, newfieldcells) => {
  const rowNumber = parseInt(aimCell.row, 10);
  const lineNumber = aimCell.line;
  const topRowNum = (rowNumber - 1).toString();
  const botRowNum = (rowNumber + 1).toString();
  const rightLineNum = findAdjasentLine(lineNumber, 'right');
  const leftLineNum = findAdjasentLine(lineNumber, 'left');
  return newfieldcells.filter((cell) => (((cell.row === topRowNum || cell.row === botRowNum)
      && cell.line === lineNumber)
      || (cell.row === aimCell.row && (cell.line === rightLineNum || cell.line === leftLineNum)))
      && cell.type === 'field');
};
