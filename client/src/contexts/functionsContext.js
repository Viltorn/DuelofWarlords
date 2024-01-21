import {
  createContext, useEffect, useState,
} from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import isInvisible from '../utils/supportFunc/isInvisible.js';
import warSubtypes from '../gameData/warriorsSubtypes.js';
import findNextRows from '../utils/supportFunc/findNextRowCells.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import findCellsForMassAttack from '../utils/supportFunc/findCellsForMassAttack.js';
import findCellsInRowForAttack from '../utils/supportFunc/findCellsInRowForAttack.js';
import socket from '../socket.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const {
    thisPlayer, fieldCells, playerPoints, gameTurn, activeCells,
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
    attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'red' })));
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
    const attackingRowCells = findCellsInRowForAttack(fieldCells, attackingLines, row, card);
    const hasMassAttack = card.features.find((feat) => feat.name === 'massAttack');
    const attackingCells = !hasMassAttack
      ? attackingRowCells : findCellsForMassAttack(fieldCells, attackingLines, card);
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
        && cell.line === alliedFrontLine && cell.content.length !== 0 && !isInvisible(cell));
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
    cellsToMove.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'green' })));
    const cellsIds = cellsToMove.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForWarMove' }));
  };

  const showCellsForWarMove = (card) => {
    const isPlayerEmptyCell = (checkingCell) => checkingCell.type === 'field' && checkingCell.player === thisPlayer && checkingCell.content.length === 0;
    if (card.subtype === 'fighter') {
      const cellsToMove = fieldCells.filter((cell) => isPlayerEmptyCell(cell)
        && (cell.line === '1' || cell.line === '3') && !cell.disabled);
      addCellsForWarMove(cellsToMove);
    }
    if (card.subtype === 'shooter') {
      const cellsToMove = fieldCells.filter((cell) => isPlayerEmptyCell(cell) && !cell.disabled);
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
      const cellsToMove = fieldCells.filter((cell) => isPlayerEmptyCell(cell) && !cell.disabled);
      addCellsForWarMove(cellsToMove);
    }
  };

  const addCellsForSpellCast = (cellsToCast, featureType) => {
    cellsToCast
      .forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: featureType })));
    const cellsIds = cellsToCast.map((cell) => cell.id);
    dispatch(battleActions.addActiveCells({ cellsIds, type: 'cellsForSpellCast' }));
  };

  const showCellsForCast = (spellcard) => {
    const isCellwithAlly = (checkingCell) => checkingCell.type === 'field' && checkingCell.content.length !== 0;
    const feature = spellcard.features[0];
    const { type, attach, aim } = feature;
    const { place } = spellcard;
    const aimPlayer = type === 'good' ? thisPlayer : getEnemyPlayer(thisPlayer);
    const cellColor = type === 'good' ? 'green' : 'red';
    if (type !== 'all' && place === '') {
      const cellsForCast = fieldCells.filter((cell) => isCellwithAlly(cell)
      && cell.player === aimPlayer && !cell.disabled);
      addCellsForSpellCast(cellsForCast, cellColor);
    } else if (type === 'all' && place === '') {
      const cellsForCast = fieldCells.filter((cell) => {
        const rightSubtype = cell.content.find((card) => aim.includes(card.subtype));
        return isCellwithAlly(cell) && !cell.disabled && rightSubtype;
      });
      addCellsForSpellCast(cellsForCast, 'red');
    } else if (place === 'warrior' && attach.includes('warrior') && type !== 'all') {
      const cellsForCast = fieldCells.filter((cell) => {
        const isPlayerOccupiedCell = cell.content.length > 0 && cell.content.length < 3;
        return isPlayerOccupiedCell && !cell.disabled && cell.player === aimPlayer && cell.type === 'field';
      });
      addCellsForSpellCast(cellsForCast, cellColor);
    } else if (place === 'warrior' && attach.includes('warrior') && type === 'all') {
      const cellsForCast = fieldCells.filter((cell) => {
        const isPlayerOccupiedCell = cell.content.length > 0 && cell.content.length < 3;
        return isPlayerOccupiedCell && !cell.disabled && cell.type === 'field';
      });
      addCellsForSpellCast(cellsForCast, 'red');
    } else if (place === 'warrior' && attach.includes('hero')) {
      const cellsForCast = fieldCells.filter((cell) => !cell.disabled && cell.player === aimPlayer && cell.type === 'hero');
      addCellsForSpellCast(cellsForCast, cellColor);
    } else if (place !== 'postponed') {
      const cellsForCast = fieldCells.filter((cell) => place === cell.type
      && (cell.content.length === 0 || place === 'bigSpell') && !cell.disabled);
      addCellsForSpellCast(cellsForCast, 'green');
    }
  };

  const findDependValue = (spell, spellOwner, allFieldCells) => {
    const { depend, dependValue, value } = spell;
    if (depend === 'goodattachments') {
      const goodAttach = allFieldCells.filter((cell) => cell.content.length !== 0 && cell.type !== 'graveyard')
        .reduce((acc, cell) => {
          const goodContent = cell.content.filter((el) => el.type === 'spell' && el.player === spellOwner);
          acc = [...acc, ...goodContent];
          return acc;
        }, []);
      return dependValue * goodAttach.length;
    }
    if (depend === 'warriorsdiff') {
      const goodWarriors = allFieldCells.filter((cell) => cell.content.length !== 0
        && cell.type === 'field' && cell.player === spellOwner).length;
      const enemyPlayer = spellOwner === 'player1' ? 'player2' : 'player1';
      const badWarriors = allFieldCells.filter((cell) => cell.content.length !== 0
      && cell.type === 'field' && cell.player === enemyPlayer).length;
      const diff = badWarriors - goodWarriors > 0 ? badWarriors - goodWarriors : 0;
      return value + dependValue * diff;
    }
    if (depend === 'postponed') {
      const cellWithFeatureType = allFieldCells
        .find((cell) => cell.content.find((item) => item.id === spell.id))?.type;
      if (cellWithFeatureType === 'postponed') {
        return dependValue;
      }
    }
    return value;
  };

  const getAddedWarPower = (curFieldCells, player, spells) => {
    const totalPower = spells.reduce((acc, spell) => {
      const spellPower = spell.depend
        ? findDependValue(spell, player, curFieldCells) : spell.value;
      acc += spellPower;
      return acc;
    }, 0);
    return totalPower;
  };

  const getWarriorPower = (card) => {
    const { attachments, currentP, player } = card;
    const newFieldCells = store.getState().battleReducer.fieldCells;
    const cardCell = newFieldCells.find((cell) => cell.id === card.cellId);
    const powerCellAttach = cardCell.attachments.filter((spell) => spell.name === 'power');
    const powerCellValue = getAddedWarPower(newFieldCells, player, powerCellAttach);
    const powerCardAttach = attachments.filter((spell) => spell.name === 'power');
    const attachPowerValue = getAddedWarPower(newFieldCells, player, powerCardAttach);
    const totalPower = currentP + attachPowerValue + powerCellValue;
    return totalPower >= 0 ? totalPower : 0;
  };

  const checkMeetCondition = (attacking, protecting, spell, type, allFieldCells) => {
    const { condition, conditionValue } = spell;
    if (type === 'warrior' || warSubtypes.includes(type)) {
      if (condition && condition === 'minPower') {
        const attackingPower = getWarriorPower(attacking);
        const attackingPowerFeature = attacking.features.find((feat) => feat.name === 'power' && (protecting ? feat.aim.includes(protecting.subtype) : true));
        const attackingAddPower = attackingPowerFeature?.value || 0;
        return (attackingPower + attackingAddPower) >= conditionValue;
      }
      if (condition && condition === 'maxPower') {
        const attackingPower = getWarriorPower(attacking);
        const attackingPowerFeature = attacking.features.find((feat) => feat.name === 'power' && (protecting ? feat.aim.includes(protecting.subtype) : true));
        const attackingAddPower = attackingPowerFeature?.value || 0;
        return (attackingPower + attackingAddPower) <= conditionValue;
      }
      if (condition && condition === 'canDie') {
        const attackingPower = attacking.type === 'warrior' ? getWarriorPower(attacking) : attacking.value;
        const attackingPowerFeature = attacking.features.find((feat) => feat.name === 'power' && (protecting ? feat.aim.includes(protecting.subtype) : true));
        const attackingAddPower = attackingPowerFeature?.value || 0;
        const { currentHP } = protecting;
        return currentHP - (attackingPower + attackingAddPower) <= 0;
      }
      if (condition && condition === 'nextRowCell') {
        const protectCell = allFieldCells.find((cell) => cell.id === protecting.cellId);
        const curRowNumber = parseInt(protectCell.row, 10);
        const currentline = protectCell.line;
        const topRowNumber = (curRowNumber - 1).toString();
        const bottomRowNumber = (curRowNumber + 1).toString();
        const topRowCell = allFieldCells.find((cell) => cell.row === topRowNumber
            && cell.line === currentline && cell.content.length === 0);
        const bottomRowCell = allFieldCells.find((cell) => cell.row === bottomRowNumber
            && cell.line === currentline && cell.content.length === 0);
        return (topRowCell || bottomRowCell) && protecting.turn !== 2;
      }
    }
    return true;
  };

  const findAttachmentType = (attachment, type) => attachment?.type === type || attachment?.type === 'all';

  const showNextRowCells = (cell) => {
    const { topRowCell, bottomRowCell } = findNextRows(cell, fieldCells);
    dispatch(battleActions.addActiveCells({ cellsIds: [topRowCell?.id, bottomRowCell?.id], type: 'cellsForWarMove' }));
    dispatch(battleActions.addAnimation({ cell: topRowCell, type: 'green' }));
    dispatch(battleActions.addAnimation({ cell: bottomRowCell, type: 'green' }));
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
        && !cardUnarmedAttachment && !cellUnarmedAttachment;
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
      dispatch(battleActions.addAnimation({ cell: postponedCell, type: 'green' }));
    }
  };

  const deleteCardfromSource = (card) => {
    const { player, status, cellId } = card;
    const cardId = card.id;
    switch (status) {
      case 'hand':
        dispatch(battleActions.deleteHandCard({ cardId, player }));
        break;
      case 'field':
        dispatch(battleActions.deleteFieldCard({ cardId, cellId }));
        break;
      case 'graveyard':
        dispatch(battleActions.deleteFieldCard({ cardId, cellId }));
        break;
      case 'postponed':
        dispatch(battleActions.deleteFieldCard({ cardId, cellId }));
        break;
      default:
        break;
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
      cellId: card.cellId,
    }));
  };

  const moveAttachedSpells = (cellId, endCellId, type) => {
    const currentField = store.getState().battleReducer.fieldCells;
    const activeCell = currentField.find((cell) => cell.id === cellId);
    if (activeCell) {
      activeCell.content.forEach((item) => {
        if (item.type === 'spell' && type === 'kill') {
          deleteCardfromSource(item);
          dispatch(battleActions.deleteAttachment({ spellId: item.id }));
          dispatch(battleActions.addToGraveyard({ card: item }));
        } else if (item.type === 'spell' && type === 'move') {
          deleteCardfromSource(item);
          dispatch(battleActions.addFieldContent({ card: item, id: endCellId }));
        } else if (item.type === 'spell' && type === 'return') {
          deleteCardfromSource(item);
          dispatch(battleActions.deleteAttachment({ spellId: item.id }));
          dispatch(battleActions.returnCard({ card: item, cost: item.cost }));
        }
      });
    }
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
