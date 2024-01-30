/* eslint-disable max-len */
import {
  createContext, useEffect, useState,
} from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import isInvisible from '../utils/supportFunc/isInvisible.js';
import warSubtypes from '../gameData/warriorsSubtypes.js';
import findNextRowCells from '../utils/supportFunc/findNextRowCells.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import isCellEmpty from '../utils/supportFunc/isCellEmpty.js';
import findCellsForMassAttack from '../utils/supportFunc/findCellsForMassAttack.js';
import findCellsInRowForAttack from '../utils/supportFunc/findCellsInRowForAttack.js';
import socket from '../socket.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const {
    thisPlayer, fieldCells, fieldCards, playerPoints, gameTurn, activeCells,
  } = useSelector((state) => state.battleReducer);
  const { cellsForAttack, cellsForWarMove, cellsForSpellCast } = activeCells;
  const [tutorStep, changeTutorStep] = useState(0);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [fontVal, setFontVal] = useState(0);
  const [isOpenChat, setOpenChat] = useState(false);
  const [isOpenInfo, toogleInfoWindow] = useState(false);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (event) => {
      // Prevent the mini-infobar from appearing on mobile.
      event.preventDefault();
      console.log('👍', 'beforeinstallprompt', event);
      // Stash the event so it can be triggered later.
      window.deferredPrompt = event;
      // Remove the 'hidden' class from the install button container.
    });
  });

  useEffect(() => {
    const setMessages = (data) => {
      dispatch(gameActions.setMessages({ data }));
    };

    const addMessage = (data) => {
      dispatch(gameActions.addMessage({ data }));
    };

    socket.on('getMessages', setMessages);
    socket.on('message', addMessage);

    return () => {
      socket.off('message', addMessage);
      socket.off('getMessages', setMessages);
    };
  }, [dispatch]);

  useEffect(() => {
    const handleWindowResize = () => {
      clearTimeout(window.resizelag);
      window.resizelag = setTimeout(() => {
        delete window.resizelag;
        const windowAspectRatio = window.innerWidth / window.innerHeight;
        const fontValue = windowAspectRatio <= 2 ? window.innerWidth / 88 : window.innerHeight / 44;
        const fontSize = `${fontValue}px`;
        setFontVal(fontValue);
        document.documentElement.style.setProperty('font-size', fontSize);
      }, 300);
    };

    handleWindowResize();
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  const getActiveCard = () => {
    const { activeCardPlayer1, activeCardPlayer2 } = store.getState().battleReducer;
    return thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
  };

  const addActiveCard = (card, player) => {
    dispatch(battleActions.addActiveCard({ card, player }));
  };

  const isAllowedCost = (checkCard) => {
    const newCost = currentPoints - checkCard.currentC;
    const fieldCard = checkCard.status !== 'hand' && checkCard.type !== 'hero';
    if (((checkCard.status === 'hand' || checkCard.type === 'hero') && newCost >= 0) || fieldCard) {
      return true;
    }
    return false;
  };

  const addCellsForAttack = (attackingCells) => {
    attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'red' })));
    const cellsIds = attackingCells.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForAttack' }));
  };

  const showCellsForWarAttack = (card) => {
    const { cellId } = card;
    const cellArr = cellId.split('.');
    const row = cellArr[0];
    const line = cellArr[1];
    const attackingLines = line <= 2 ? ['3', '4'] : ['1', '2'];
    const alliedFrontLine = line <= 2 ? '1' : '3';
    const attackingRowCells = findCellsInRowForAttack({
      fieldCards, fieldCells, attackingLines, row, card,
    });
    const hasMassAttack = card.features.find((feat) => feat.name === 'massAttack');
    const attackingCells = !hasMassAttack
      ? attackingRowCells : findCellsForMassAttack({
        fieldCards, fieldCells, attackingLines, card,
      });
    const attackingHeroCell = fieldCells.find((cell) => cell.type === 'hero' && cell.player !== thisPlayer);

    if (card.subtype === 'shooter' || card.subtype === 'flyer') {
      if (attackingCells.length !== 0) {
        addCellsForAttack(attackingCells);
      }
      if (attackingRowCells.length === 0 && !attackingHeroCell.disabled) {
        addCellsForAttack([attackingHeroCell]);
      }
    }
    if (card.subtype === 'fighter') {
      const blockingAlly = fieldCells.find((cell) => cell.row === row
        && cell.line === alliedFrontLine && cell.content.length !== 0 && !isInvisible(cell, card));
      if ((line === '4' || line === '2') && blockingAlly) {
        return;
      }
      if (attackingCells.length > 1 && !hasMassAttack) {
        const attackCell = attackingCells.find((cell) => attackingLines[0] === cell.line);
        addCellsForAttack([attackCell]);
      } else if (attackingCells.length === 1 || hasMassAttack) {
        addCellsForAttack(attackingCells);
      }
      if (attackingRowCells.length === 0 && !attackingHeroCell.disabled) {
        addCellsForAttack([attackingHeroCell]);
      }
    }
  };

  const addCellsForWarMove = (cellsToMove) => {
    cellsToMove.forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: 'green' })));
    const cellsIds = cellsToMove.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForWarMove' }));
  };

  const showCellsForWarMove = (card) => {
    if (card.subtype === 'fighter') {
      const cellsToMove = fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id) && cell.player === thisPlayer
        && (cell.line === '1' || cell.line === '3') && !cell.disabled && cell.type === 'field');
      addCellsForWarMove(cellsToMove);
    }
    if (card.subtype === 'shooter') {
      const cellsToMove = fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id) && cell.player === thisPlayer
       && !cell.disabled && cell.type === 'field');
      addCellsForWarMove(cellsToMove);
      // fieldCells.forEach((cell) => {
      //   if (isPlayerEmptyCell(cell)
      //    && (cell.line === '2' || cell.line === '4') && !cell.disabled) {
      //     dispatch(battleActions.addAnimation({ cell, type: 'green' }));
      //     setMoveCells((prev) => [...prev, cell.id]);
      //   }
      // });
    }
    if (card.subtype === 'flyer') {
      const cellsToMove = fieldCells.filter((cell) => isCellEmpty(fieldCards, cell.id)
      && cell.player === thisPlayer && !cell.disabled && cell.type === 'field');
      addCellsForWarMove(cellsToMove);
    }
  };

  const addCellsForSpellCast = (cellsToCast, featureType) => {
    cellsToCast
      .forEach((cell) => dispatch(battleActions.addAnimation({ cellId: cell.id, type: featureType })));
    const cellsIds = cellsToCast.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForSpellCast' }));
  };

  const showCellsForCast = (spellcard) => {
    const feature = spellcard.features[0];
    const { type, attach, aim } = feature;
    const { place } = spellcard;
    const aimPlayer = type === 'good' ? thisPlayer : getEnemyPlayer(thisPlayer);
    const cellColor = type === 'good' ? 'green' : 'red';
    if (type !== 'all' && place === '') {
      const cellsForCast = fieldCells.filter((cell) => !isCellEmpty(fieldCards, cell.id)
      && cell.player === aimPlayer && !cell.disabled && cell.type === 'field');
      addCellsForSpellCast(cellsForCast, cellColor);
    }
    if (type === 'all' && place === '') {
      const cellsForCast = fieldCells.filter((cell) => {
        const rightSubtype = fieldCards.find((card) => aim.includes(card.subtype) && card.cellId === cell.id);
        return !isCellEmpty(fieldCards, cell.id) && !cell.disabled && rightSubtype && cell.type === 'field';
      });
      addCellsForSpellCast(cellsForCast, 'red');
    }
    if (place === 'warrior' && attach.includes('warrior') && type !== 'all') {
      const cellsForCast = fieldCells.filter((cell) => {
        const cardsInCell = fieldCards.filter((card) => card.cellId === cell.id).length;
        const isPlayerOccupiedCell = cardsInCell > 0 && cardsInCell < 3;
        return isPlayerOccupiedCell && !cell.disabled && cell.player === aimPlayer && cell.type === 'field';
      });
      addCellsForSpellCast(cellsForCast, cellColor);
    }
    if (place === 'warrior' && attach.includes('warrior') && type === 'all') {
      const cellsForCast = fieldCells.filter((cell) => {
        const cardsInCell = fieldCards.filter((card) => card.cellId === cell.id).length;
        const isPlayerOccupiedCell = cardsInCell > 0 && cardsInCell < 3;
        return isPlayerOccupiedCell && !cell.disabled && cell.type === 'field';
      });
      addCellsForSpellCast(cellsForCast, 'red');
    }

    if (place === 'warrior' && attach.includes('hero')) {
      const cellsForCast = fieldCells.filter((cell) => !cell.disabled && cell.player === aimPlayer && cell.type === 'hero');
      addCellsForSpellCast(cellsForCast, cellColor);
    }

    if (place !== 'postponed') {
      const cellsForCast = fieldCells.filter((cell) => place === cell.type
      && (isCellEmpty(fieldCards, cell.id) || place === 'bigSpell') && !cell.disabled);
      addCellsForSpellCast(cellsForCast, 'green');
    }
  };

  const findDependValue = (spell, spellOwner, allFieldCells, curFieldCards) => {
    const {
      depend, dependValue, value, id,
    } = spell;
    if (depend === 'goodAttachments') {
      const goodAttach = curFieldCards.filter((card) => card.type === 'spell'
        && card.player === spellOwner && card.status === 'field');
      return dependValue * goodAttach.length;
    }
    if (depend === 'warriorsDiff') {
      const goodWarriorsQty = curFieldCards.filter((card) => card.type === 'warrior'
        && card.player === spellOwner && card.status === 'field').length;
      const enemyPlayer = spellOwner === 'player1' ? 'player2' : 'player1';
      const badWarriorsQty = curFieldCards.filter((card) => card.type === 'warrior'
        && card.player === enemyPlayer && card.status === 'field').length;
      const diff = badWarriorsQty - goodWarriorsQty > 0 ? badWarriorsQty - goodWarriorsQty : 0;
      return value + dependValue * diff;
    }
    if (depend === 'postponed') {
      const cardWithFeature = curFieldCards.find((card) => card.id === id);
      const cellId = cardWithFeature?.cellId;
      if (cellId === 'postponed1' || cellId === 'postponed2') {
        return dependValue;
      }
    }
    return value;
  };

  const getAddedWarPower = (curFieldCells, curFieldCards, player, spells) => {
    const totalPower = spells.reduce((acc, spell) => {
      const spellPower = spell.depend
        ? findDependValue(spell, player, curFieldCells, curFieldCards) : spell.value;
      acc += spellPower;
      return acc;
    }, 0);
    return totalPower;
  };

  const getWarriorPower = (card) => {
    const { attachments, currentP, player } = card;
    const newFieldCells = store.getState().battleReducer.fieldCells;
    const newFieldCards = store.getState().battleReducer.fieldCards;
    const cardCell = newFieldCells.find((cell) => cell.id === card.cellId);
    const powerCellAttach = cardCell.attachments.filter((spell) => spell.name === 'power');
    const powerCellVal = getAddedWarPower(newFieldCells, newFieldCards, player, powerCellAttach);
    const powerCardAttach = attachments.filter((spell) => spell.name === 'power');
    const attachPowerVal = getAddedWarPower(newFieldCells, newFieldCards, player, powerCardAttach);
    const totalPower = currentP + attachPowerVal + powerCellVal;
    return totalPower >= 0 ? totalPower : 0;
  };

  const checkMeetCondition = (attackingCard, defendingCard, spell, type, allFieldCells) => {
    const { condition, conditionValue } = spell;
    if (type === 'warrior' || warSubtypes.includes(type)) {
      if (condition && condition === 'minPower') {
        const attackingPower = getWarriorPower(attackingCard);
        const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
        const attackingAddPower = attackingPowerFeature?.value || 0;
        return (attackingPower + attackingAddPower) >= conditionValue;
      }
      if (condition && condition === 'maxPower') {
        const attackingPower = getWarriorPower(attackingCard);
        const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
        const attackingAddPower = attackingPowerFeature?.value || 0;
        return (attackingPower + attackingAddPower) <= conditionValue;
      }
      if (condition && condition === 'canDie') {
        const attackingPower = attackingCard.type === 'warrior' ? getWarriorPower(attackingCard) : attackingCard.value;
        const attackingPowerFeature = attackingCard.features.find((feat) => feat.name === 'power' && (defendingCard ? feat.aim.includes(defendingCard.subtype) : true));
        const attackingAddPower = attackingPowerFeature?.value || 0;
        const { currentHP } = defendingCard;
        return currentHP - (attackingPower + attackingAddPower) <= 0;
      }
      if (condition && condition === 'nextRowCell') {
        const protectCell = allFieldCells.find((cell) => cell.id === defendingCard.cellId);
        const curRowNumber = parseInt(protectCell.row, 10);
        const currentline = protectCell.line;
        const topRowNumber = (curRowNumber - 1).toString();
        const bottomRowNumber = (curRowNumber + 1).toString();
        const topRowCell = allFieldCells.find((cell) => cell.row === topRowNumber
            && cell.line === currentline && cell.content.length === 0);
        const bottomRowCell = allFieldCells.find((cell) => cell.row === bottomRowNumber
            && cell.line === currentline && cell.content.length === 0);
        return (topRowCell || bottomRowCell) && defendingCard.turn !== 2;
      }
    }
    return true;
  };

  const findAttachmentType = (attachment, type) => attachment?.type === type || attachment?.type === 'all';

  const showNextRowCells = (cell) => {
    const { topRowCell, bottomRowCell } = findNextRowCells(cell, fieldCells, fieldCards);
    dispatch(battleActions.addActiveCells({ cellsIds: [topRowCell?.id, bottomRowCell?.id], type: 'cellsForWarMove' }));
    dispatch(battleActions.addAnimation({ cellId: topRowCell?.id, type: 'green' }));
    dispatch(battleActions.addAnimation({ cellId: bottomRowCell?.id, type: 'green' }));
  };

  const handleAnimation = (activeCard, option) => {
    if (option === 'delete') {
      dispatch(battleActions.deleteAnimation());
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForWarMove' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForSpellCast' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForAttack' }));
      return;
    }

    if (!isAllowedCost(activeCard) || activeCard.disabled || gameTurn !== thisPlayer) {
      return;
    }

    const {
      type, status, attachments, turn,
    } = activeCard;
    const isCardPostponed = activeCard.cellId === 'postponed1' || activeCard.cellId === 'postponed2';

    if (type === 'warrior') {
      const currentCell = fieldCells.find((cell) => cell.id === activeCard.cellId);
      const cardImmobileAttachment = attachments.find((feature) => feature.name === 'immobile' && checkMeetCondition(activeCard, feature, 'warrior'));
      const cellImmobileAttachment = currentCell?.attachments?.find((feature) => feature.name === 'immobile' && feature.aim.includes(activeCard.subtype) && checkMeetCondition(activeCard, null, feature, 'warrior'));
      const movingAttachment = attachments.find((feature) => feature.name === 'moving' && checkMeetCondition(activeCard, null, feature, 'warrior'));
      const moverowAttachment = attachments.find((feature) => feature.name === 'moveNextRow' && checkMeetCondition(activeCard, null, feature, 'warrior'));
      const canMove = !cardImmobileAttachment && !activeCard.features.find((feature) => feature.name === 'immobile')
        && turn === 0 && !cellImmobileAttachment;
      const cellUnarmedAttachment = currentCell?.attachments?.find((feature) => feature.name === 'unarmed' && feature.aim.includes(activeCard.subtype) && checkMeetCondition(activeCard, null, feature, 'warrior'));
      const cardUnarmedAttachment = attachments.find((feature) => feature.name === 'unarmed' && checkMeetCondition(activeCard, null, feature, 'warrior'));
      const canAttack = !activeCard.features.find((feature) => feature.name === 'unarmed') && turn === 0
        && !cardUnarmedAttachment && !cellUnarmedAttachment && status === 'field';
      if ((status === 'hand' || isCardPostponed) && activeCard.player === thisPlayer) {
        showCellsForWarMove(activeCard);
      }
      if ((findAttachmentType(moverowAttachment, 'bad') && activeCard.player !== thisPlayer)
      || (findAttachmentType(moverowAttachment, 'good') && activeCard.player === thisPlayer)) {
        showNextRowCells(currentCell);
      }
      if ((findAttachmentType(movingAttachment, 'bad') && activeCard.player !== thisPlayer)
      || (findAttachmentType(movingAttachment, 'good') && activeCard.player === thisPlayer)) {
        showCellsForWarMove(activeCard);
      }
      if (status === 'field' && canMove && activeCard.player === thisPlayer) {
        showCellsForWarMove(activeCard);
      }

      if (canAttack && activeCard.player === thisPlayer) {
        showCellsForWarAttack(activeCard);
      }
    }

    if (type === 'hero' && turn === 0 && activeCard.player === thisPlayer) {
      showCellsForCast(activeCard);
    }

    if (type === 'spell' && (status === 'hand' || isCardPostponed) && activeCard.player === thisPlayer) {
      showCellsForCast(activeCard);
    }

    const postponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
    const cantPostpone = activeCard.features.find((feat) => feat.name === 'cantPostpone');
    if (status === 'hand' && postponedCell.content.length === 0 && !postponedCell.disabled && !cantPostpone && activeCard.player === thisPlayer) {
      dispatch(battleActions.addAnimation({ cellId: postponedCell.id, type: 'green' }));
    }
  };

  const deleteCardfromSource = (card) => {
    const { player, status, cellId } = card;
    const cardId = card.id;
    if (status === 'hand') {
      dispatch(battleActions.deleteHandCard({ cardId, player }));
    } else {
      dispatch(battleActions.deleteFieldCard({ cardId }));
    }

    if (cellId === 'postponed1' || cellId === 'postponed2') {
      dispatch(battleActions.turnPostponed({ player, status: 'cover' }));
    }
    if (card.type === 'warrior') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
  };

  const canBeAttacked = (cellcard) => {
    if (cellsForAttack.includes(cellcard.cellId) && (cellcard.type === 'warrior' || cellcard.type === 'hero')) {
      return true;
    }
    return false;
  };

  const canBeCast = (CellId) => {
    if (cellsForSpellCast.includes(CellId)) {
      return true;
    }
    return false;
  };

  const canBeMoved = (CellId) => {
    if (cellsForWarMove.includes(CellId)) {
      return true;
    }
    return false;
  };

  const isKilled = (pow, hp) => (hp - pow) <= 0;

  const changeCardHP = (power, health, card) => {
    dispatch(battleActions.changeHP({
      health: health - power,
      cardId: card.id,
    }));
  };

  const moveAttachedSpells = (cellId, endCellId, type) => {
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const spellsInCell = currentFieldCards.filter((card) => card.cellId === cellId && card.type === 'spell');
    spellsInCell.forEach((card) => {
      deleteCardfromSource(card);
      if (type === 'kill') {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.addToGraveyard({ card }));
      } else if (type === 'move') {
        dispatch(battleActions.addFieldContent({ card, id: endCellId }));
      } else if (type === 'return') {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.returnCard({ card, cost: card.cost }));
      }
    });
  };

  const deleteOtherActiveCard = (card1, card2, thisplayer) => {
    const card1Id = card1 ? card1.id : null;
    const card2Id = card2 ? card2.id : null;
    if (card1Id === card2Id) {
      const anotherPlayer = thisplayer === 'player1' ? 'player2' : 'player1';
      dispatch(battleActions.deleteActiveCard({ player: anotherPlayer }));
    }
  };

  return (
    <FunctionContext.Provider value={{
      checkMeetCondition,
      getWarriorPower,
      isKilled,
      changeCardHP,
      deleteOtherActiveCard,
      canBeCast,
      canBeMoved,
      moveAttachedSpells,
      canBeAttacked,
      isAllowedCost,
      handleAnimation,
      deleteCardfromSource,
      getActiveCard,
      addActiveCard,
      findDependValue,
      tutorStep,
      changeTutorStep,
      isOpenMenu,
      setOpenMenu,
      fontVal,
      isOpenChat,
      setOpenChat,
      isOpenInfo,
      toogleInfoWindow,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
