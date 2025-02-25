/* eslint-disable max-len */
import { useDispatch, useSelector, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import findEmptyNextRowCells from '../utils/supportFunc/findEmptyNextRowCells.js';
import findCellsForWarAttack from '../utils/supportFunc/findCellsForWarAttack.js';
import findCellsForWarMove from '../utils/supportFunc/findCellsForWarMove.js';
import findCellsForSpellCast from '../utils/supportFunc/findCellsForSpellCast.js';
import isAllowedCost from '../utils/supportFunc/isAllowedCost.js';
// import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import getAddedWarPower from '../utils/supportFunc/getAddedWarPower.js';
import isSpellMeetCondition from '../utils/supportFunc/isSpellMeetCondition.js';
import findAdjasentCells from '../utils/supportFunc/findAdjasentCells.js';
import isCellEmpty from '../utils/supportFunc/isCellEmpty.js';

const useAnimaActions = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const {
    thisPlayer,
    gameTurn,
  } = useSelector((state) => state.battleReducer);

  const getWarriorPower = (card, powType) => {
    if (!card) return 0;

    const { attachments } = card;
    const curPower = powType === 'defPower' ? card.currentDP : card.currentP;
    if (!curPower) return 0;
    const newFieldCells = store.getState().battleReducer.fieldCells;
    const newFieldCards = store.getState().battleReducer.fieldCards;
    const cardCell = newFieldCells.find((cell) => cell.id === card.cellId);
    const powerCellAttach = cardCell.attachments.filter((spell) => (spell.name === 'power' || spell.name === powType)
      && isSpellMeetCondition({
        attackingCard: card, spell, type: 'warrior', allFieldCells: newFieldCells, allFieldCards: newFieldCards,
      }));
    const powerCellVal = getAddedWarPower(curPower, newFieldCards, powerCellAttach);
    const powerCardAttach = attachments.filter((spell) => (spell.name === 'power' || spell.name === powType)
       && isSpellMeetCondition({
         attackingCard: card, spell, type: 'warrior', allFieldCells: newFieldCells, allFieldCards: newFieldCards,
       }));
    const attachPowerVal = getAddedWarPower(curPower, newFieldCards, powerCardAttach);
    const totalPower = curPower + attachPowerVal + powerCellVal;
    return totalPower >= 0 ? totalPower : 0;
  };

  const checkMeetCondition = (spellData) => {
    const attackingPower = spellData.attackingCard
      ? getWarriorPower(spellData.attackingCard) : null;
    return isSpellMeetCondition({
      ...spellData, attackingPower,
    });
  };

  const warHasSpecialFeature = ({
    warCard, fieldCards, fieldCells, featureName,
  }) => {
    const defaultConditionData = {
      attackingCard: warCard, type: 'warrior', allFieldCells: fieldCells, allFieldCards: fieldCards,
    };
    const warCell = fieldCells.find((cell) => cell.id === warCard.cellId);
    const warCellFeatureAttachment = warCell?.attachments?.find((feature) => feature.name === featureName && checkMeetCondition({ ...defaultConditionData, spell: feature }) && (feature.aim.includes(warCard.subtype) || warCell.type === 'hero'));
    const warCardFeatureAttachment = warCard.attachments.find((feature) => feature.name === featureName && checkMeetCondition({ ...defaultConditionData, spell: feature }));
    const warHasFeature = warCard.features.find((feature) => feature.name === featureName && !feature.attach);
    return warHasFeature || warCardFeatureAttachment || warCellFeatureAttachment;
  };

  const addNextLinesCellsForMove = (data) => {
    const { activeCard, fieldCards, fieldCells } = data;
    const currentCell = fieldCells.find((cell) => cell.id === activeCard.cellId);
    const emptyNextRowCellsIds = findEmptyNextRowCells(currentCell, fieldCells, fieldCards).map((cell) => cell?.id);
    dispatch(battleActions.addActiveCells({ cellsIds: [...emptyNextRowCellsIds], type: 'cellsForWarMove' }));
    emptyNextRowCellsIds.forEach((cellId) => dispatch(battleActions.addAnimation({ cellId, type: 'green' })));
  };

  const addAdjasentCellsForMove = (data) => {
    const { activeCard, fieldCards, fieldCells } = data;
    const aimCell = fieldCells.find((cell) => cell.id === activeCard.cellId);
    const adjasentCells = findAdjasentCells(fieldCells, aimCell);
    const cellsToMoveIds = adjasentCells
      .filter((cell) => isCellEmpty(fieldCards, cell.id) && cell.player === activeCard.player)
      .map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds: [...cellsToMoveIds], type: 'cellsForWarMove' }));
    cellsToMoveIds.forEach((cellId) => dispatch(battleActions.addAnimation({ cellId, type: 'green' })));
  };

  const addCellsAnimaForAttack = (card, curFieldCards, curFieldCells) => {
    const attackingCells = findCellsForWarAttack(card, curFieldCards, curFieldCells, warHasSpecialFeature);
    attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'red' })));
    const cellsIds = attackingCells.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForAttack' }));
  };

  const addAllCellsForWarMove = (data) => {
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

  const addAnimatedCells = (activeCard, fieldCells, fieldCards, playerTurn) => {
    const {
      type, status, turn,
    } = activeCard;

    if (type === 'warrior') {
      const movingAttachment = warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'moving',
      });
      const moveRowAttachment = warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'moveNextRow',
      });
      const moveAdjasentAttachment = warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'moveAdjasent',
      });
      const canMove = !warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'immobile',
      }) && turn === 0 && status === 'field';
      const canAttack = !warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'unarmed',
      }) && turn === 0 && status === 'field';

      if ((status === 'hand') && activeCard.player === playerTurn) {
        addAllCellsForWarMove({
          activeCard, player: activeCard.player, fieldCards, fieldCells,
        });
      }
      if (moveRowAttachment && moveRowAttachment.player === playerTurn) {
        addNextLinesCellsForMove({ activeCard, fieldCards, fieldCells });
      }
      if ((movingAttachment && movingAttachment.player === playerTurn)) {
        addAllCellsForWarMove({
          activeCard, player: activeCard.player, fieldCards, fieldCells,
        });
      }
      if (moveAdjasentAttachment && moveAdjasentAttachment.player === playerTurn) {
        addAdjasentCellsForMove({
          activeCard, fieldCards, fieldCells,
        });
      }

      if ((canMove && activeCard.player === playerTurn) && !moveRowAttachment && !moveAdjasentAttachment && !movingAttachment) {
        addAllCellsForWarMove({
          activeCard, player: activeCard.player, fieldCards, fieldCells,
        });
      }

      if (canAttack && activeCard.player === playerTurn) {
        addCellsAnimaForAttack(activeCard, fieldCards, fieldCells);
      }
    }

    if (type === 'hero' && turn === 0 && activeCard.player === playerTurn) {
      addCellsAnimaForSpellCast({
        spellCard: activeCard, player: playerTurn, fieldCards, fieldCells,
      });
    }

    if (type === 'spell' && status === 'hand' && activeCard.player === playerTurn) {
      addCellsAnimaForSpellCast({
        spellCard: activeCard, player: playerTurn, fieldCards, fieldCells,
      });
    }
  };

  const handleAnimation = (activeCard, option) => {
    if (option === 'delete') {
      dispatch(battleActions.deleteAnimation());
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForWarMove' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForSpellCast' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForAttack' }));
      return;
    }
    const { fieldCells, fieldCards, playerPoints } = store.getState().battleReducer;
    const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;

    if (!isAllowedCost(activeCard, currentPoints)
        || activeCard.disabled || gameTurn !== thisPlayer) {
      return;
    }

    addAnimatedCells(activeCard, fieldCells, fieldCards, gameTurn);
  };

  return {
    handleAnimation,
    checkMeetCondition,
    getWarriorPower,
    addAnimatedCells,
    warHasSpecialFeature,
    addAdjasentCellsForMove,
    addNextLinesCellsForMove,
    addAllCellsForWarMove,
  };
};

export default useAnimaActions;
