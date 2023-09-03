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
    checkMeetCondition,
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

  const findProtection = (attacking, protecting, attackType) => {
    const protectingCell = fieldCells.find((cell) => cell.id === protecting.cellId);
    const cardProtection = protecting.attachments.find((spell) => spell.name === 'protection' && spell.protectAim.includes(attackType));
    const cellProtection = protectingCell.attachments.find((spell) => spell.name === 'protection' && spell.protectAim.includes(attackType));
    const canCellProtect = cellProtection
      && checkMeetCondition(attacking, cellProtection, attackType);
    const canCardProtect = cardProtection
      && checkMeetCondition(attacking, cardProtection, attackType);
    if (canCellProtect) {
      return cellProtection;
    }
    if (canCardProtect) {
      return cardProtection;
    }
    return null;
  };

  const findOnAttack = (card) => {
    const cardCell = fieldCells.find((cell) => cell.id === card.cellId);
    const onAttackCellAttach = cardCell.attachments.filter((spell) => spell.condition === 'onattack');
    const onAttackCardAttach = card.attachments.filter((spell) => spell.condition === 'onattack');
    const onAttackCardFeature = card.onattack ? [card.onattack] : [];
    return [...onAttackCellAttach, ...onAttackCardAttach, ...onAttackCardFeature];
  };

  const findOnSpells = (card, cell, type) => {
    const onPlayCellAttach = cell.attachments?.filter((spell) => spell.condition === type) ?? [];
    const onPlayCardAttach = card.attachments?.filter((spell) => spell.condition === type) ?? [];
    const onPlayCardFeature = card[type] ? [card[type]] : [];
    return [...onPlayCellAttach, ...onPlayCardAttach, ...onPlayCardFeature];
  };

  const makeCardAttack = (cast, attackedCard) => {
    const receivedHealth = attackedCard.currentHP;
    const spellPower = cast.value;
    const protection = findProtection(cast, attackedCard, 'spell');
    const protectionVal = protection ? protection.value : 0;
    const calculatedPower = spellPower - protectionVal > 0 ? spellPower - protectionVal : 0;
    if (isKilled(calculatedPower, receivedHealth)) {
      deleteCardfromSource(attackedCard);
      dispatch(battleActions.addToGraveyard({ card: attackedCard }));
      moveAttachedSpells(attackedCard, null, 'kill');
    } else {
      changeCardHP(calculatedPower, receivedHealth, attackedCard);
      if (protection && protection.charges === 1) {
        const protectionCard = fieldCells.reduce((acc, cell) => {
          const searchingCard = cell.content.find((el) => el.id === protection.id);
          if (searchingCard) {
            acc = searchingCard;
          }
          return acc;
        }, {});
        dispatch(battleActions.deleteAttachment({ spellId: protection.id }));
        deleteCardfromSource(protectionCard);
        dispatch(battleActions.addToGraveyard({ card: protectionCard }));
      }
    }
  };

  const makeFeatureCast = (feature, aimCell, applyingCard) => {
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const newAimCell = newfieldCells.find((cell) => cell.id === aimCell.id);
    const aimCard = applyingCard ?? newAimCell.content.find((item) => item.type === 'warrior' || item.type === 'hero');
    const {
      name, type, aim, value, charges, id,
    } = feature;
    if (name === 'attack') {
      if (aim.includes('field')) {
        if (type === 'all') {
          fieldCells
            .filter((cell) => cell.content.length !== 0 && cell.type === 'field')
            .forEach((cell) => {
              const warriorCard = cell.content.find((item) => item.type === 'warrior' && aim.includes(item.subtype));
              if (warriorCard) {
                makeCardAttack(feature, warriorCard);
              }
            });
        }
      }
      if (aim.includes('line')) {
        const { line } = aimCell;
        fieldCells
          .filter((cell) => cell.line === line && cell.content.length !== 0 && cell.type === 'field')
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior');
            makeCardAttack(feature, warriorCard);
          });
      } else if (aim.includes('row') && type === 'all') {
        const { row } = aimCell;
        fieldCells
          .filter((cell) => cell.row === row && cell.content.length !== 0 && cell.type === 'field')
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior');
            makeCardAttack(feature, warriorCard);
          });
      } else {
        makeCardAttack(feature, aimCard);
      }
    } else if (name === 'selfheroattack') {
      const { player } = aimCard;
      const heroCard = fieldCells
        .find((cell) => cell.type === 'hero' && cell.player === player)
        .content.find((el) => el.type === 'hero');
      const receivedHealth = getWarriorProperty(heroCard, 'health');
      if (value === 'power') {
        const attackingPower = getWarriorProperty(aimCard, 'power');
        changeCardHP(attackingPower, receivedHealth, heroCard);
      }
    } else if (name === 'moverow' && aimCard?.status === 'field') {
      const currentRowNumber = parseInt(aimCell.row, 10);
      const currentline = aimCell.line;
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
    } else if (name === 'stun') {
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
    } else if (name === 'return') {
      if (aim.includes('warrior') && aimCard.type === 'warrior') {
        handleAnimation(aimCard, 'delete');
        moveAttachedSpells(aimCard, null, 'return');
        deleteCardfromSource(aimCard);
        dispatch(battleActions.returnCard({ card: aimCard }));
        dispatch(battleActions.deleteActiveCard({ player: aimCard.player }));
      }
    }

    if (charges === 1) {
      const featureCard = fieldCells.reduce((acc, cell) => {
        const searchingCard = cell.content.find((el) => el.id === id);
        if (searchingCard) {
          acc = searchingCard;
        }
        return acc;
      }, {});
      dispatch(battleActions.deleteAttachment({ spellId: id }));
      deleteCardfromSource(featureCard);
      dispatch(battleActions.addToGraveyard({ card: featureCard }));
    }
  };

  const makeFeatureAttach = (feature, aimCell) => {
    const currentfieldCells = store.getState().battleReducer.fieldCells;
    const currentAimCell = currentfieldCells.find((cell) => cell.id === aimCell.id);
    const aimCard = currentAimCell.content.find((item) => item.type === 'warrior' || item.type === 'hero');
    const {
      name, type, aim,
    } = feature;
    if (aim.includes('field') && type === 'good') {
      if (aim.includes('warrior')) {
        const cellIds = getPlayerCellIds(thisPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (aim.includes('hero')) {
        const heroCell = fieldCells.find((cell) => cell.player === thisPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId: heroCell.id, feature, type: 'cell' }));
      }
    } else if (aim.includes('field') && type === 'bad') {
      const enemyPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
      if (aim.includes('warrior')) {
        const cellIds = getPlayerCellIds(enemyPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (aim.includes('hero')) {
        const heroCell = fieldCells.find((cell) => cell.player === enemyPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId: heroCell.id, feature, type: 'cell' }));
      }
    } else if (aim.includes('field') && type === 'all') {
      if (aim.includes('warrior')) {
        const cellIds = fieldCells
          .filter((cell) => cell.type === 'field')
          .map((cell) => cell.id);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (aim.includes('hero')) {
        const heroCellIds = fieldCells
          .filter((cell) => cell.type === 'hero')
          .map((cell) => cell.id);
        heroCellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
    } else if (aim.includes('row')) {
      if (type === 'all') {
        const rowCellsIds = fieldCells
          .filter((cell) => cell.row === aimCell.row)
          .map((cell) => cell.id);
        rowCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
    } else if (type === 'good') {
      if (name === 'moving') {
        dispatch(battleActions.addAttachment({ cellId: aimCell.id, feature }));
        const newfieldCells = store.getState().battleReducer.fieldCells;
        const currentCell = newfieldCells.find((cell) => cell.id === aimCard.cellId);
        const movingCard = currentCell.content.find((item) => item.type === 'warrior');
        dispatch(battleActions.addActiveCard({ card: movingCard, player: thisPlayer }));
        handleAnimation(movingCard, 'add');
      } else if (aim.includes('warrior') || aim.includes('hero')) {
        dispatch(battleActions.addAttachment({ cellId: aimCell.id, feature }));
      }
    } else if (type === 'bad') {
      if (aim.includes('warrior') || aim.includes('hero')) {
        dispatch(battleActions.addAttachment({ cellId: aimCell.id, feature }));
      }
    }
  };

  const sendCardFromField = (card, destination) => {
    const { type, features } = card;
    const cardCell = fieldCells.find((cell) => cell.id === card.cellId);
    const lastSpell = type === 'warrior' ? features.lastcall : features.find((feat) => feat.condition === 'lastcall');
    if (lastSpell && destination === 'grave') {
      makeFeatureCast(lastSpell, cardCell);
    }
    if (type === 'spell') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
    deleteCardfromSource(card);
    if (destination === 'grave') {
      dispatch(battleActions.addToGraveyard({ card }));
    } else {
      dispatch(battleActions.returnCard({ card }));
    }
  };

  return (
    <AbilitiesContext.Provider value={{
      makeFeatureCast,
      makeFeatureAttach,
      sendCardFromField,
      checkMeetCondition,
      findProtection,
      findOnAttack,
      findOnSpells,
    }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};

export default AbilitiesContext;
