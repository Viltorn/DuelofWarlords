/* eslint-disable max-len */
import { useDispatch, useSelector, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import findNextRowCells from '../utils/supportFunc/findNextRowCells';
import findCellsForWarAttack from '../utils/supportFunc/findCellsForWarAttack.js';
import findCellsForWarMove from '../utils/supportFunc/findCellsForWarMove.js';
import findCellsForSpellCast from '../utils/supportFunc/findCellsForSpellCast.js';
import isAllowedCost from '../utils/supportFunc/isAllowedCost.js';
import findAttachmentType from '../utils/supportFunc/findAttachmentType.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import getAddedWarPower from '../utils/supportFunc/getAddedWarPower.js';
import isSpellMeetCondition from '../utils/supportFunc/isSpellMeetCondition.js';

const useAnimaActions = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const {
    thisPlayer,
    gameTurn,
  } = useSelector((state) => state.battleReducer);

  const getWarriorPower = (card) => {
    if (!card) {
      return 0;
    }
    const { attachments, currentP } = card;
    const newFieldCells = store.getState().battleReducer.fieldCells;
    const newFieldCards = store.getState().battleReducer.fieldCards;
    const cardCell = newFieldCells.find((cell) => cell.id === card.cellId);
    const powerCellAttach = cardCell.attachments.filter((spell) => spell.name === 'power');
    const powerCellVal = getAddedWarPower(currentP, newFieldCards, powerCellAttach);
    const powerCardAttach = attachments.filter((spell) => spell.name === 'power');
    const attachPowerVal = getAddedWarPower(currentP, newFieldCards, powerCardAttach);
    const totalPower = currentP + attachPowerVal + powerCellVal;
    return totalPower >= 0 ? totalPower : 0;
  };

  const addNextLinesCellsAnima = (data) => {
    const { activeCard, fieldCards, fieldCells } = data;
    const currentCell = fieldCells.find((cell) => cell.id === activeCard.cellId);
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
    const warCellFeatureAttachment = warCell?.attachments?.find((feature) => feature.name === featureName && feature.aim.includes(warCard.subtype) && checkMeetCondition({ ...defaultConditionData, spell: feature }));
    const warCardFeatureAttachment = warCard.attachments.find((feature) => feature.name === featureName && checkMeetCondition({ ...defaultConditionData, spell: feature }));
    const warHasFeature = warCard.features.find((feature) => feature.name === featureName);
    return warCellFeatureAttachment || warCardFeatureAttachment || warHasFeature;
  };

  const addAnimatedCells = (activeCard, fieldCells, fieldCards, playerTurn) => {
    const {
      type, status, turn,
    } = activeCard;

    if (type === 'warrior') {
      const movingAttachment = warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'moving',
      });
      const moverowAttachment = warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'moveNextRow',
      });
      const canMove = !warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'immobile',
      }) && turn === 0 && status === 'field';
      const canAttack = !warHasSpecialFeature({
        warCard: activeCard, fieldCells, fieldCards, featureName: 'unarmed',
      }) && turn === 0 && status === 'field';

      if ((status === 'hand') && activeCard.player === playerTurn) {
        addCellsAnimaForWarMove({
          activeCard, player: playerTurn, fieldCards, fieldCells,
        });
      }
      if ((findAttachmentType(moverowAttachment, 'bad') && activeCard.player !== playerTurn)
        || (findAttachmentType(moverowAttachment, 'good') && activeCard.player === playerTurn)) {
        addNextLinesCellsAnima({
          activeCard, fieldCards, fieldCells,
        });
      }
      if (findAttachmentType(movingAttachment, 'bad') && activeCard.player !== playerTurn) {
        addCellsAnimaForWarMove({
          activeCard, player: getEnemyPlayer(playerTurn), fieldCards, fieldCells,
        });
      }
      if (findAttachmentType(movingAttachment, 'good') && activeCard.player === playerTurn) {
        addCellsAnimaForWarMove({
          activeCard, player: playerTurn, fieldCards, fieldCells,
        });
      }
      if (canMove && activeCard.player === playerTurn) {
        addCellsAnimaForWarMove({
          activeCard, player: playerTurn, fieldCards, fieldCells,
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
  };
};

export default useAnimaActions;
