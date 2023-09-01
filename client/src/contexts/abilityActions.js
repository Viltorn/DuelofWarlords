import {
  useContext, createContext,
} from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from './functionsContext.js';

const AbilitiesContext = createContext({});

export const AbilityProvider = ({ children }) => {
  const {
    isKilled,
    deleteCardfromSource,
    moveAttachedSpells,
    changeCardHP,
    getWarriorProperty,
    setMoveCells,
    handleAnimation,
  } = useContext(functionContext);
  const store = useStore();
  const { fieldCells, thisPlayer } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();

  const getPlayerCellIds = (player) => fieldCells.reduce((acc, cell) => {
    if (cell.type === 'field' && cell.player === player) {
      acc = [...acc, cell.id];
    }
    return acc;
  }, []);

  const makeCardAttack = (cast, attackedCard, cell) => {
    const receivedHealth = getWarriorProperty(attackedCard, 'health');
    const spellPower = cast.value;
    const protection = attackedCard.attachments.find((feat) => feat.name === 'protection' && feat.aim.includes('spell'));
    const protectionVal = protection ? protection.value : 0;
    const calculatedPower = spellPower - protectionVal > 0 ? spellPower - protectionVal : 0;
    if (isKilled(calculatedPower, receivedHealth)) {
      deleteCardfromSource(attackedCard);
      dispatch(battleActions.addToGraveyard({ card: attackedCard }));
      moveAttachedSpells(attackedCard, null, 'kill');
    } else {
      changeCardHP(calculatedPower, receivedHealth, attackedCard);
      if (protection && protection.charges === 1) {
        const protectionCard = cell.content.find((el) => el.id === protection.id);
        dispatch(battleActions.deleteAttachment({ spellId: protection.id }));
        deleteCardfromSource(protectionCard);
        dispatch(battleActions.addToGraveyard({ card: protectionCard }));
      }
    }
  };

  const makeFeatureCast = (feature, aimCard) => {
    const thisCell = fieldCells.find((cell) => cell.id === aimCard?.cellId);
    if (feature.place === '' && feature.type === 'bad') {
      if (feature.name === 'attack') {
        if (feature.aim.includes('line')) {
          const { line } = thisCell;
          fieldCells
            .filter((cell) => cell.line === line && cell.content.length !== 0)
            .forEach((cell) => {
              const warriorCard = cell.content.find((item) => item.type === 'warrior');
              makeCardAttack(feature, warriorCard, cell);
            });
        } else {
          makeCardAttack(feature, aimCard, thisCell);
        }
      }
      if (feature.name === 'moverow' && aimCard.status === 'field') {
        const newfieldCells = store.getState().battleReducer.fieldCells;
        const currentRowNumber = parseInt(thisCell.row, 10);
        const currentline = thisCell.line;
        const topRowNumber = (currentRowNumber + 1).toString();
        const bottomRowNumber = (currentRowNumber - 1).toString();
        const topRowCell = newfieldCells.find((cell) => cell.row === topRowNumber
          && cell.line === currentline && cell.content.length === 0);
        const bottomRowCell = newfieldCells.find((cell) => cell.row === bottomRowNumber
          && cell.line === currentline && cell.content.length === 0);
        setMoveCells([topRowCell?.id, bottomRowCell?.id]);
        dispatch(battleActions.addAnimation({ cell: topRowCell, type: 'green' }));
        dispatch(battleActions.addAnimation({ cell: bottomRowCell, type: 'green' }));
        const currentCell = newfieldCells.find((cell) => cell.id === aimCard.cellId);
        const movingCard = currentCell.content.find((item) => item.type === 'warrior');
        dispatch(battleActions.addActiveCard({ card: movingCard, player: thisPlayer }));
      }
      if (feature.name === 'stun') {
        const currentTurn = aimCard.turn;
        if (currentTurn === 0) {
          dispatch(battleActions.turnCardLeft({
            cardId: aimCard.id,
            cellId: aimCard.cellId,
            qty: 2,
          }));
        } else if (currentTurn === 1) {
          dispatch(battleActions.turnCardLeft({
            cardId: aimCard.id,
            cellId: aimCard.cellId,
            qty: 1,
          }));
        }
      }
    }
    if (feature.place === 'attach' && feature.type === 'good') {
      if (feature.name === 'moving') {
        dispatch(battleActions.addAttachment({ cellId: aimCard.cellId, feature }));
        const newfieldCells = store.getState().battleReducer.fieldCells;
        const currentCell = newfieldCells.find((cell) => cell.id === aimCard.cellId);
        const movingCard = currentCell.content.find((item) => item.type === 'warrior');
        dispatch(battleActions.addActiveCard({ card: movingCard, player: thisPlayer }));
        handleAnimation(movingCard, 'add');
      }
    }
    if (feature.place === 'postponed' && feature.type === 'good') {
      if (feature.aim.includes('warrior')) {
        const cellIds = getPlayerCellIds(thisPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (feature.aim.includes('hero')) {
        const cellId = fieldCells.find((cell) => cell.player === thisPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId, feature, type: 'warrior' }));
      }
    }
  };

  return (
    <AbilitiesContext.Provider value={{
      makeFeatureCast,
    }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};

export default AbilitiesContext;
