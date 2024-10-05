/* eslint-disable max-len */
import { useDispatch, useSelector, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import findNextRowCells from '../utils/supportFunc/findNextRowCells';
import findCellsForWarAttack from '../utils/supportFunc/findCellsForWarAttack.js';
import findCellsForWarMove from '../utils/supportFunc/findCellsForWarMove.js';
import findCellsForSpellCast from '../utils/supportFunc/findCellsForSpellCast.js';
import isHeroSpellAlLowed from '../utils/supportFunc/isHeroSpellAlLowed.js';
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
    playerPoints,
    gameTurn,
  } = useSelector((state) => state.battleReducer);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;

  const getWarriorPower = (card) => {
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

  const checkMeetCondition = (spellData) => {
    const attackingPower = spellData.attackingCard
      ? getWarriorPower(spellData.attackingCard) : null;
    return isSpellMeetCondition({
      ...spellData, attackingPower,
    });
  };

  const handleAnimation = (activeCard, option) => {
    if (option === 'delete') {
      dispatch(battleActions.deleteAnimation());
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForWarMove' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForSpellCast' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForAttack' }));
      return;
    }
    const { fieldCells } = store.getState().battleReducer;
    const { fieldCards } = store.getState().battleReducer;
    const playerHeroCard = fieldCards.find((card) => card.type === 'hero' && card.player === thisPlayer);

    if (!isAllowedCost(activeCard, currentPoints)
        || activeCard.disabled || gameTurn !== thisPlayer
        || !isHeroSpellAlLowed(activeCard, playerHeroCard)) {
      return;
    }

    const {
      type, status, attachments, turn,
    } = activeCard;
    const isCardPostponed = activeCard.cellId === 'postponed1' || activeCard.cellId === 'postponed2';

    if (type === 'warrior') {
      const currentCell = fieldCells.find((cell) => cell.id === activeCard.cellId);
      const defaultConditionData = {
        attackingCard: activeCard, type: 'warrior', allFieldCells: fieldCells, allFieldCards: fieldCards,
      };
      const cardImmobileAttachment = attachments.find((feature) => feature.name === 'immobile' && checkMeetCondition({ ...defaultConditionData, spell: feature }));
      const cellImmobileAttachment = currentCell?.attachments?.find((feature) => feature.name === 'immobile' && feature.aim.includes(activeCard.subtype) && checkMeetCondition({ ...defaultConditionData, spell: feature }));
      const movingAttachment = attachments.find((feature) => feature.name === 'moving' && checkMeetCondition({ ...defaultConditionData, spell: feature }));
      const moverowAttachment = attachments.find((feature) => feature.name === 'moveNextRow' && checkMeetCondition({ ...defaultConditionData, spell: feature }));
      const canMove = !cardImmobileAttachment && !activeCard.features.find((feature) => feature.name === 'immobile')
        && turn === 0 && !cellImmobileAttachment;
      const cellUnarmedAttachment = currentCell?.attachments?.find((feature) => feature.name === 'unarmed' && feature.aim.includes(activeCard.subtype) && checkMeetCondition({ ...defaultConditionData, spell: feature }));
      const cardUnarmedAttachment = attachments.find((feature) => feature.name === 'unarmed' && checkMeetCondition({ ...defaultConditionData, spell: feature }));
      const canAttack = !activeCard.features.find((feature) => feature.name === 'unarmed') && turn === 0
        && !cardUnarmedAttachment && !cellUnarmedAttachment && status === 'field';
      if ((status === 'hand' || isCardPostponed) && activeCard.player === thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: thisPlayer, fieldCards, fieldCells,
        });
      }
      if ((findAttachmentType(moverowAttachment, 'bad') && activeCard.player !== thisPlayer)
        || (findAttachmentType(moverowAttachment, 'good') && activeCard.player === thisPlayer)) {
        addNextLinesCellsAnima({
          currentCell, fieldCards, fieldCells,
        });
      }
      if (findAttachmentType(movingAttachment, 'bad') && activeCard.player !== thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: getEnemyPlayer(thisPlayer), fieldCards, fieldCells,
        });
      }
      if (findAttachmentType(movingAttachment, 'good') && activeCard.player === thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: thisPlayer, fieldCards, fieldCells,
        });
      }
      if (status === 'field' && canMove && activeCard.player === thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: thisPlayer, fieldCards, fieldCells,
        });
      }

      if (canAttack && activeCard.player === thisPlayer) {
        addCellsAnimaForAttack(activeCard, fieldCards, fieldCells);
      }
    }

    if (type === 'hero' && turn === 0 && activeCard.player === thisPlayer) {
      addCellsAnimaForSpellCast({
        spellCard: activeCard, player: thisPlayer, fieldCards, fieldCells,
      });
    }

    if (type === 'spell' && (status === 'hand' || isCardPostponed) && activeCard.player === thisPlayer) {
      addCellsAnimaForSpellCast({
        spellCard: activeCard, player: thisPlayer, fieldCards, fieldCells,
      });
    }

    const postponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
    const cantPostpone = activeCard.features.find((feat) => feat.name === 'cantPostpone');
    if (status === 'hand' && postponedCell.content.length === 0 && !postponedCell.disabled && !cantPostpone && activeCard.player === thisPlayer) {
      dispatch(battleActions.addAnimation({ cellId: postponedCell.id, type: 'green' }));
    }
  };

  return {
    handleAnimation,
    checkMeetCondition,
    getWarriorPower,
  };
};

export default useAnimaActions;
