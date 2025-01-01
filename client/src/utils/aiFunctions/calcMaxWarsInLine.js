import getWarsNumInLine from './getWarsNumInLine';

const calcMaxWarsInLine = (cellsIds, fieldCards) => {
  const warsInEachLine = cellsIds.map((cellId) => {
    const lineId = cellId.length === 1 ? cellId : cellId[2];
    return getWarsNumInLine(lineId, fieldCards);
  });
  console.log(`wars in lines: ${warsInEachLine}`);
  return Math.max(...warsInEachLine);
};

export default calcMaxWarsInLine;
