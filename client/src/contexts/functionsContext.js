import { createContext, useEffect, useState } from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const { thisPlayer, fieldCells, playerPoints } = useSelector((state) => state.battleReducer);
  const [attackCells, setAttackCells] = useState([]);
  const [castCells, setCastCells] = useState([]);
  const [moveCells, setMoveCells] = useState([]);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  console.log(moveCells);

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
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  const getActiveCard = () => {
    const { activeCardPlayer1, activeCardPlayer2 } = store.getState().battleReducer;
    return thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
  };

  const isAllowedCost = (checkCard) => {
    const newCost = currentPoints - checkCard.cost;
    if ((checkCard.status === 'hand' && newCost >= 0) || checkCard.status !== 'hand') {
      return true;
    }
    return false;
  };

  const findEnemies = (card) => {
    const { cellId } = card;
    const cellArr = cellId.split('.');
    const row = cellArr[0];
    const line = cellArr[1];
    const attackingLines = line <= 2 ? ['3', '4'] : ['1', '2'];
    const attackingRowCells = fieldCells.filter((cell) => cell.row === row
    && attackingLines.includes(cell.line) && cell.content.length !== 0);

    const attackingCells = !card.features.massAttack
      ? attackingRowCells
      : fieldCells.filter((cell) => cell.type === 'field' && cell.content.length !== 0 && attackingLines.includes(cell.line));

    const attackingHero = fieldCells.find((cell) => cell.type === 'hero' && cell.player !== thisPlayer);
    if (card.subtype === 'shooter') {
      if (attackingCells.length !== 0) {
        attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'red' })));
        setAttackCells(attackingCells.map((cell) => cell.id));
      }
      if (attackingRowCells.length === 0) {
        dispatch(battleActions.addAnimation({ cell: attackingHero, type: 'red' }));
        setAttackCells([attackingHero.id]);
      }
    }
    if (card.subtype === 'fighter' || card.subtype === 'flyer') {
      if (attackingCells.length > 1 && !card.features.massAttack) {
        const attackCell = attackingCells.find((cell) => attackingLines[0] === cell.line);
        dispatch(battleActions.addAnimation({ cell: attackCell, type: 'red' }));
        setAttackCells([attackCell.id]);
      } else if (attackingCells.length === 1) {
        dispatch(battleActions.addAnimation({ cell: attackingCells[0], type: 'red' }));
        setAttackCells([attackingCells[0].id]);
      } else if (card.features.massAttack) {
        attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'red' })));
        setAttackCells(attackingCells.map((cell) => cell.id));
      }
      if (attackingRowCells.length === 0) {
        dispatch(battleActions.addAnimation({ cell: attackingHero, type: 'red' }));
        setAttackCells([attackingHero.id]);
      }
    }
  };

  const findFieldCells = (card) => {
    const isPlayerEmptyCell = (checkingCell) => checkingCell.type === 'field' && checkingCell.player === thisPlayer && checkingCell.content.length === 0;
    if (card.subtype === 'fighter') {
      const newMoveCells = fieldCells.reduce((acc, cell) => {
        if (isPlayerEmptyCell(cell) && (cell.line === '1' || cell.line === '3')) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          acc = [...acc, cell.id];
        }
        return acc;
      }, []);
      setMoveCells(newMoveCells);
    }
    if (card.subtype === 'shooter') {
      const newMoveCells = fieldCells.reduce((acc, cell) => {
        if (isPlayerEmptyCell(cell) && (cell.line === '2' || cell.line === '4')) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          acc = [...acc, cell.id];
        }
        return acc;
      }, []);
      setMoveCells(newMoveCells);
    }
    if (card.subtype === 'flyer') {
      const newMoveCells = fieldCells.reduce((acc, cell) => {
        if (isPlayerEmptyCell(cell)) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          acc = [...acc, cell.id];
        }
        return acc;
      }, []);
      setMoveCells(newMoveCells);
    }
  };

  const findCellsForCast = (feature) => {
    const isCellwithAlly = (checkingCell) => checkingCell.type === 'field' && checkingCell.content.length !== 0;
    if (feature.type === 'good' && feature.place === '') {
      const newCastCells = fieldCells.reduce((acc, cell) => {
        if (isCellwithAlly(cell) && cell.player === thisPlayer) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          acc = [...acc, cell.id];
        }
        return acc;
      }, []);
      setCastCells(newCastCells);
      return;
    }
    if (feature.type === 'bad' && feature.place === '') {
      const newCastCells = fieldCells.reduce((acc, cell) => {
        if (isCellwithAlly(cell) && cell.player !== thisPlayer) {
          dispatch(battleActions.addAnimation({ cell, type: 'red' }));
          acc = [...acc, cell.id];
        }
        return acc;
      }, []);
      setCastCells(newCastCells);
      return;
    }
    if (feature.place === 'attach') {
      const { aim, type } = feature;
      const newCastCells = fieldCells.reduce((acc, cell) => {
        const isPlayerOccupiedCell = cell.player === thisPlayer
          && cell.content.length > 0 && cell.content.length < 3;
        if (isPlayerOccupiedCell && type === 'good') {
          if (cell.type === 'field' && aim.includes('warrior')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
            acc = [...acc, cell.id];
          }
          if (cell.type === 'hero' && aim.includes('hero')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
            acc = [...acc, cell.id];
          }
        }
        if (isPlayerOccupiedCell && type === 'bad') {
          if (cell.type === 'field' && aim.includes('warrior')) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
            acc = [...acc, cell.id];
          }
          if (cell.type === 'hero' && aim.includes('hero')) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
            acc = [...acc, cell.id];
          }
        }
        return acc;
      }, []);
      setCastCells(newCastCells);
    } else if (feature.place !== 'postponed') {
      const newCastCells = fieldCells.reduce((acc, cell) => {
        if (feature.place === cell.type && cell.content.length === 0) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          acc = [...acc, cell.id];
        }
        return acc;
      }, []);
      setCastCells(newCastCells);
    }
  };

  const handleAnimation = (activeCard, status) => {
    if (status === 'delete') {
      dispatch(battleActions.deleteAnimation());
      setMoveCells([]);
      setAttackCells([]);
      setCastCells([]);
      return;
    }
    if (!isAllowedCost(activeCard) || activeCard.player !== thisPlayer) {
      return;
    }

    const isCardPostponed = activeCard.cellId === 'postponed1' || activeCard.cellId === 'postponed2';

    if (activeCard.type === 'warrior') {
      const immobileAttachment = activeCard.attachments.find((feature) => feature.name === 'immobile');
      const movingAttachment = activeCard.attachments.find((feature) => feature.name === 'moving');
      const canMove = (!immobileAttachment && !activeCard.features.immobile
        && activeCard.turn === 0) || movingAttachment;
      const unarmedAttachment = activeCard.attachments.find((feature) => feature.name === 'unarmed');
      const canAttack = !activeCard.features.unarmed && activeCard.turn === 0 && !unarmedAttachment;
      if (activeCard.status === 'hand' || isCardPostponed) {
        findFieldCells(activeCard);
      }
      if (activeCard.status === 'field' && canMove) {
        findFieldCells(activeCard);
      }
      if (canAttack) {
        findEnemies(activeCard);
      }
    }

    if (activeCard.type === 'spell' && activeCard.status === 'hand') {
      findCellsForCast(activeCard.features[0]);
    }

    const posponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
    if (activeCard.status === 'hand' && posponedCell.content.length === 0) {
      dispatch(battleActions.addAnimation({ cell: posponedCell, type: 'green' }));
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
      default:
        break;
    }
    if (cellId === 'postponed1' || cellId === 'postponed2') {
      dispatch(battleActions.turnPostponed({ player, status: 'cover' }));
    }
  };

  const canBeAttacked = (cellcard) => {
    if (attackCells.includes(cellcard.cellId) && (cellcard.type === 'warrior' || cellcard.type === 'hero')) {
      return true;
    }
    return false;
  };

  const canBeCast = (CellId) => {
    if (castCells.includes(CellId)) {
      return true;
    }
    return false;
  };

  const canBeMoved = (CellId) => {
    if (moveCells.includes(CellId)) {
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

  const moveAttachedSpells = (movingCard, endCellId, type) => {
    if (movingCard.type === 'warrior' && movingCard.status === 'field') {
      const activeCell = fieldCells.find((cell) => cell.id === movingCard.cellId);
      activeCell.content.forEach((item) => {
        if (item.type === 'spell' && type === 'kill') {
          deleteCardfromSource(item);
          dispatch(battleActions.deleteAttachment({ spellId: item.id }));
          dispatch(battleActions.addToGraveyard({ card: item }));
        } else if (item.type === 'spell' && type === 'move') {
          dispatch(battleActions.addFieldContent({ activeCard: item, id: endCellId }));
          deleteCardfromSource(item);
        } else if (item.type === 'spell' && type === 'return') {
          dispatch(battleActions.returnCard({ card: item }));
          deleteCardfromSource(item);
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

  const getWarriorProperty = (card, property) => {
    const { attachments } = card;
    const currentPropertyVal = property === 'health' ? card.currentHP : card.currentP;
    const propertyAttachments = attachments.filter((spell) => spell.name === property);
    const totalPropertyVal = propertyAttachments.length !== 0
      ? currentPropertyVal + propertyAttachments.reduce((acc, spell) => {
        acc += spell.value;
        return acc;
      }, 0) : currentPropertyVal;
    return totalPropertyVal;
  };

  return (
    <FunctionContext.Provider value={{
      setMoveCells,
      getWarriorProperty,
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
      windowWidth,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
