import isWarInRow from './isWarInRow';
import getRowForMiddleCell from './getRowForMiddleCell';

export default (availableCells, fieldCards, rightPlayer) => availableCells
  .filter((cell) => isWarInRow(getRowForMiddleCell[cell], fieldCards, rightPlayer));
