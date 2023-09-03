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

  const isInvisible = (cell) => {
    const cellInvis = cell.attachments?.find((feat) => feat.name === 'invisible');
    const warrior = cell.content.find((item) => item.type === 'warrior');
    const cardInvis = warrior?.attachments.find((feat) => feat.name === 'invisible');
    return cardInvis || cellInvis || warrior?.features.invisible;
  };

  const findEnemies = (card) => {
    const { cellId } = card;
    const cellArr = cellId.split('.');
    const row = cellArr[0];
    const line = cellArr[1];
    const attackingLines = line <= 2 ? ['3', '4'] : ['1', '2'];
    const attackingRowCells = fieldCells.filter((cell) => cell.row === row && !isInvisible(cell)
    && attackingLines.includes(cell.line) && cell.content.length !== 0 && !cell.disabled);

    const attackingCells = !card.features.massAttack
      ? attackingRowCells
      : fieldCells.filter((cell) => cell.type === 'field' && cell.content.length !== 0 && attackingLines.includes(cell.line));

    const attackingHero = fieldCells.find((cell) => cell.type === 'hero' && cell.player !== thisPlayer);
    if (card.subtype === 'shooter') {
      if (attackingCells.length !== 0) {
        attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'red' })));
        setAttackCells(attackingCells.map((cell) => cell.id));
      }
      if (attackingRowCells.length === 0 && !attackingHero.disabled) {
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
      if (attackingRowCells.length === 0 && !attackingHero.disabled) {
        dispatch(battleActions.addAnimation({ cell: attackingHero, type: 'red' }));
        setAttackCells([attackingHero.id]);
      }
    }
  };

  const findFieldCells = (card) => {
    const isPlayerEmptyCell = (checkingCell) => checkingCell.type === 'field' && checkingCell.player === thisPlayer && checkingCell.content.length === 0;
    if (card.subtype === 'fighter') {
      fieldCells.forEach((cell) => {
        if (isPlayerEmptyCell(cell) && (cell.line === '1' || cell.line === '3') && !cell.disabled) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          setMoveCells((prev) => [...prev, cell.id]);
        }
      });
    }
    if (card.subtype === 'shooter') {
      fieldCells.forEach((cell) => {
        if (isPlayerEmptyCell(cell) && (cell.line === '2' || cell.line === '4') && !cell.disabled) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          setMoveCells((prev) => [...prev, cell.id]);
        }
      });
    }
    if (card.subtype === 'flyer') {
      fieldCells.forEach((cell) => {
        if (isPlayerEmptyCell(cell) && !cell.disabled) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          setMoveCells((prev) => [...prev, cell.id]);
        }
      });
    }
  };

  const findCellsForCast = (spellcard) => {
    const isCellwithAlly = (checkingCell) => checkingCell.type === 'field' && checkingCell.content.length !== 0;
    const feature = spellcard.features[0];
    const { place } = spellcard;
    if (feature.type === 'good' && place === '') {
      fieldCells.forEach((cell) => {
        if (isCellwithAlly(cell) && cell.player === thisPlayer && !cell.disabled) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          setCastCells((prev) => [...prev, cell.id]);
        }
      });
    } else if (feature.type === 'bad' && place === '') {
      fieldCells.forEach((cell) => {
        if (isCellwithAlly(cell) && cell.player !== thisPlayer && !cell.disabled) {
          dispatch(battleActions.addAnimation({ cell, type: 'red' }));
          setCastCells((prev) => [...prev, cell.id]);
        }
      });
    } else if (feature.type === 'all' && place === '') {
      fieldCells.forEach((cell) => {
        const rightSubtype = cell.content.find((item) => feature.aim.includes(item.subtype));
        if (isCellwithAlly(cell) && !cell.disabled && rightSubtype) {
          dispatch(battleActions.addAnimation({ cell, type: 'red' }));
          setCastCells((prev) => [...prev, cell.id]);
        }
      });
    } else if (place === 'warrior') {
      const { aim, type } = feature;
      fieldCells.forEach((cell) => {
        const isPlayerOccupiedCell = cell.content.length > 0 && cell.content.length < 3;
        if (isPlayerOccupiedCell && type === 'good' && !cell.disabled && cell.player === thisPlayer) {
          if (cell.type === 'field' && aim.includes('warrior')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
            setCastCells((prev) => [...prev, cell.id]);
          }
          if (cell.type === 'hero' && aim.includes('hero') && !cell.disabled) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
            setCastCells((prev) => [...prev, cell.id]);
          }
        }
        if (isPlayerOccupiedCell && type === 'bad' && cell.player !== thisPlayer) {
          if (cell.type === 'field' && aim.includes('warrior') && !cell.disabled) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
            setCastCells((prev) => [...prev, cell.id]);
          }
          if (cell.type === 'hero' && aim.includes('hero') && !cell.disabled) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
            setCastCells((prev) => [...prev, cell.id]);
          }
        }
      });
    } else if (place !== 'postponed') {
      fieldCells.forEach((cell) => {
        if (place === cell.type && cell.content.length === 0 && !cell.disabled) {
          dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          setCastCells((prev) => [...prev, cell.id]);
        }
      });
    }
  };

  const getWarriorPower = (card) => {
    const { attachments, currentP } = card;
    const powerAttachments = attachments.filter((spell) => spell.name === 'power');
    const attachPowerValue = powerAttachments.reduce((acc, spell) => {
      acc += spell.value;
      return acc;
    }, 0);
    const totalPower = currentP + attachPowerValue;
    return totalPower;
  };

  const checkMeetCondition = (checking, spell, type) => {
    const { condition, conditionValue } = spell;
    if (type === 'warrior') {
      if (condition && condition === 'minPower') {
        const attackingPower = getWarriorPower(checking);
        const meetCondition = attackingPower >= conditionValue;
        return meetCondition;
      }
      if (condition && condition === 'maxPower') {
        const attackingPower = getWarriorPower(checking);
        const meetCondition = attackingPower <= conditionValue;
        return meetCondition;
      }
    }
    return true;
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
      const currentCell = fieldCells.find((cell) => cell.id === activeCard.cellId);
      const cardImmobileAttachment = activeCard.attachments.find((feature) => feature.name === 'immobile' && checkMeetCondition(activeCard, feature, 'warrior'));
      const cellImmobileAttachment = currentCell?.attachments?.find((feature) => feature.name === 'immobile' && feature.aim.includes(activeCard.subtype) && checkMeetCondition(activeCard, feature, 'warrior'));
      const movingAttachment = activeCard.attachments.find((feature) => feature.name === 'moving' && checkMeetCondition(activeCard, feature, 'warrior'));
      const canMove = (!cardImmobileAttachment && !activeCard.features.immobile
        && activeCard.turn === 0 && !cellImmobileAttachment) || movingAttachment;
      const cellUnarmedAttachment = currentCell?.attachments?.find((feature) => feature.name === 'unarmed' && feature.aim.includes(activeCard.subtype) && checkMeetCondition(activeCard, feature, 'warrior'));
      const cardUnarmedAttachment = activeCard.attachments.find((feature) => feature.name === 'unarmed' && checkMeetCondition(activeCard, feature, 'warrior'));
      const canAttack = !activeCard.features.unarmed && activeCard.turn === 0
        && !cardUnarmedAttachment && !cellUnarmedAttachment;
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
      findCellsForCast(activeCard);
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

  return (
    <FunctionContext.Provider value={{
      checkMeetCondition,
      setMoveCells,
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
      windowWidth,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
