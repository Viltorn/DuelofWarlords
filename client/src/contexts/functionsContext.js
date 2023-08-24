import { createContext, useEffect, useState } from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const { thisPlayer, fieldCells, playerPoints } = useSelector((state) => state.battleReducer);
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
      }
      if (attackingRowCells.length === 0) {
        dispatch(battleActions.addAnimation({ cell: attackingHero, type: 'red' }));
      }
    }
    if (card.subtype === 'fighter' || card.subtype === 'flyer') {
      if (attackingCells.length > 1 && !card.features.massAttack) {
        const attackCell = attackingCells.find((cell) => attackingLines[0] === cell.line);
        dispatch(battleActions.addAnimation({ cell: attackCell, type: 'red' }));
      } else if (attackingCells.length === 1) {
        dispatch(battleActions.addAnimation({ cell: attackingCells[0], type: 'red' }));
      } else if (card.features.massAttack) {
        attackingCells.forEach((cell) => dispatch(battleActions.addAnimation({ cell, type: 'red' })));
      }
      if (attackingRowCells.length === 0) {
        dispatch(battleActions.addAnimation({ cell: attackingHero, type: 'red' }));
      }
    }
  };

  const findFieldCells = (card) => {
    switch (card.subtype) {
      case 'fighter':
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player === thisPlayer && cell.content.length === 0
          && (cell.line === '1' || cell.line === '3')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
        });
        break;
      case 'shooter':
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player === thisPlayer && cell.content.length === 0
          && (cell.line === '2' || cell.line === '4')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
        });
        break;
      case 'flyer':
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player === thisPlayer && cell.content.length === 0) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
        });
        break;
      default:
        break;
    }
  };

  const handleAnimation = (activeCard, status) => {
    if (status === 'delete') {
      fieldCells.forEach(() => dispatch(battleActions.deleteAnimation()));
      return;
    }
    if (!isAllowedCost(activeCard)) {
      return;
    }
    if ((activeCard.type === 'warrior' && activeCard.status === 'hand') || (activeCard.cellId === 'postponed1' || activeCard.cellId === 'postponed2')) {
      findFieldCells(activeCard);
    }
    if ((activeCard.type === 'warrior' && activeCard.status === 'field' && !activeCard.features.moved
    && !activeCard.features.immobile && !activeCard.features.attached?.immobile
    && activeCard.turn === 0)) {
      findFieldCells(activeCard);
      findEnemies(activeCard);
    }
    if (activeCard.type === 'spell' && activeCard.status === 'hand') {
      if (activeCard.features.good) {
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player === thisPlayer && cell.content.length !== 0) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
        });
      }
      if (activeCard.features.bad) {
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player !== thisPlayer && cell.content.length !== 0) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
          }
        });
      }
      if (activeCard.features.attachGood) {
        const { aim } = activeCard.features.attachGood;
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player === thisPlayer && cell.content.length > 0
            && cell.content.length < 3 && aim.includes('warrior')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
          if (cell.type === 'hero' && cell.player === thisPlayer && cell.content.length < 3 && aim.includes('hero')) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
        });
      }
      if (activeCard.features.attachBad) {
        const { aim } = activeCard.features.attachBad;
        fieldCells.forEach((cell) => {
          if (cell.type === 'field' && cell.player !== thisPlayer && cell.content.length > 0
            && cell.content.length < 3 && aim.includes('warrior')) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
          }
          if (cell.type === 'hero' && cell.player !== thisPlayer && cell.content.length < 3 && aim.includes('hero')) {
            dispatch(battleActions.addAnimation({ cell, type: 'red' }));
          }
        });
      } else {
        fieldCells.forEach((cell) => {
          if (activeCard.features[cell.type] && cell.content.length === 0) {
            dispatch(battleActions.addAnimation({ cell, type: 'green' }));
          }
        });
      }
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
      default:
        break;
    }
    if (cellId === 'postponed1' || cellId === 'postponed2') {
      dispatch(battleActions.turnPosponed({ player, status: 'cover' }));
    }
  };

  const getActiveCard = () => {
    const { activeCardPlayer1, activeCardPlayer2 } = store.getState().battleReducer;
    return thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
  };

  return (
    <FunctionContext.Provider value={{
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
