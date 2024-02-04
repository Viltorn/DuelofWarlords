/* eslint-disable max-len */
import { useDispatch } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import findNextRowCells from '../utils/supportFunc/findNextRowCells';
import findCellsForWarAttack from '../utils/supportFunc/findCellsForWarAttack.js';
import findCellsForWarMove from '../utils/supportFunc/findCellsForWarMove.js';
import findCellsForSpellCast from '../utils/supportFunc/findCellsForSpellCast.js';

const useAnimaActions = () => {
  const dispatch = useDispatch();
  const addNextLinesCellsAnima = (data) => {
    const { currentCell, fieldCards, fieldCells } = data;
    const { topRowCell, bottomRowCell } = findNextRowCells(currentCell, fieldCells, fieldCards);
    dispatch(battleActions.addActiveCells({ cellsIds: [topRowCell?.id, bottomRowCell?.id], type: 'cellsForWarMove' }));
    dispatch(battleActions.addAnimation({ cellId: topRowCell?.id, type: 'green' }));
    dispatch(battleActions.addAnimation({ cellId: bottomRowCell?.id, type: 'green' }));
  };

  const addCellsAnimaForAttack = (card, curFieldCards, curFieldCells) => {
    const attackingCells = findCellsForWarAttack(card, curFieldCards, curFieldCells);
    attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'red' })));
    const cellsIds = attackingCells.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForAttack' }));
  };

  const addCellsAnimaForWarMove = (data) => {
    const cellsToMove = findCellsForWarMove(data);
    cellsToMove.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' })));
    const cellsIds = cellsToMove.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForWarMove' }));
  };

  const addCellsAnimaForSpellCast = (data) => {
    const { spellCard } = data;
    const feature = spellCard.features[0];
    const { place } = spellCard;
    const animaColor = feature.type === 'good' ? 'green' : 'red';
    const cellsToCast = findCellsForSpellCast({ ...data, place, feature });
    cellsToCast
      .forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: animaColor })));
    const cellsIds = cellsToCast.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForSpellCast' }));
  };

  return {
    addNextLinesCellsAnima,
    addCellsAnimaForAttack,
    addCellsAnimaForWarMove,
    addCellsAnimaForSpellCast,
  };
};

export default useAnimaActions;
