import {
  useContext, createContext,
} from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { spellsCells } from '../gameData/heroes&spellsCellsData';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from './functionsContext.js';

const getRandomIndex = (range) => Math.floor(Math.random() * range);

const AbilitiesContext = createContext({});

export const AbilityProvider = ({ children }) => {
  const {
    isKilled,
    deleteCardfromSource,
    moveAttachedSpells,
    changeCardHP,
    getWarriorPower,
    setMoveCells,
    handleAnimation,
    checkMeetCondition,
    findDependValue,
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

  const findSpell = (attacking, protecting, attackType, name) => {
    const protectingCell = fieldCells.find((cell) => cell.id === protecting.cellId);
    const cardSpell = protecting.attachments.find((spell) => spell.name === name
      && spell.aim.includes(attackType));
    const cellSpell = protectingCell.attachments.find((spell) => spell.name === name
      && spell.aim.includes(attackType));
    const canCellProtect = cellSpell
      && checkMeetCondition(attacking, protecting, cellSpell, attackType);
    const canCardProtect = cardSpell
      && checkMeetCondition(attacking, protecting, cardSpell, attackType);
    if (canCellProtect) {
      return cellSpell;
    }
    if (canCardProtect) {
      return cardSpell;
    }
    return null;
  };

  const getProtectionVal = (attackingPower, protection, health) => {
    const { type, val } = protection.value;
    if (type === 'number') {
      return val;
    }
    if (type === 'percent') {
      const calculatedVal = Math.ceil(attackingPower * val);
      return calculatedVal === attackingPower ? attackingPower - 1 : calculatedVal;
    }
    if (type === 'immortal') {
      return 1 + attackingPower - health;
    }
    return 0;
  };

  const findOnAttack = (card) => {
    const cardCell = fieldCells.find((cell) => cell.id === card.cellId);
    const onAttackCellAttach = cardCell.attachments.filter((spell) => spell.condition === 'onattack');
    const onAttackCardAttach = card.attachments.filter((spell) => spell.condition === 'onattack');
    const onAttackCardFeature = card.features.filter((spell) => spell.condition === 'onattack');
    return [...onAttackCellAttach, ...onAttackCardAttach, ...onAttackCardFeature];
  };

  const findTriggerSpells = (card, cell, spelltype, cardtype) => {
    const triggerCellAttach = cell.attachments?.filter((spell) => spell.condition === spelltype
      && spell.aim.includes(cardtype)) ?? [];
    const triggerCardAttach = card.attachments?.filter((spell) => spell.condition === spelltype
      && spell.aim.includes(cardtype)) ?? [];
    const triggerCardFeatures = card.features.filter((spell) => spell.condition === spelltype
    && spell.aim.includes(cardtype)) ?? [];
    return [...triggerCellAttach, ...triggerCardAttach, ...triggerCardFeatures];
  };

  const makeCardAttack = (cast, attackedCard) => {
    const receivedHealth = attackedCard.currentHP;
    const spellPower = findDependValue(cast);
    const protection = findSpell(cast, attackedCard, 'spell', 'protection');
    const protectionVal = protection ? getProtectionVal(spellPower, protection, receivedHealth) : 0;
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

  const applySpellEffect = (feature, aimCard, aimCell, cellsfield) => {
    const {
      value, aim, name,
    } = feature;
    const { player } = aimCard;
    if (name === 'attack') {
      dispatch(battleActions.addAnimation({ cell: aimCell, type: 'attacked' }));
      makeCardAttack(feature, aimCard);
    } else if (name === 'selfheroattack') {
      const heroCard = fieldCells
        .find((cell) => cell.type === 'hero' && cell.player === player)
        .content.find((el) => el.type === 'hero');
      const receivedHealth = heroCard.currentHP;
      if (value === 'power') {
        const attackingPower = getWarriorPower(aimCard);
        changeCardHP(attackingPower, receivedHealth, heroCard);
      }
    } else if (name === 'moverow' && aimCard?.status === 'field') {
      const currentRowNumber = parseInt(aimCell.row, 10);
      const currentline = aimCell.line;
      const topRowNumber = (currentRowNumber + 1).toString();
      const bottomRowNumber = (currentRowNumber - 1).toString();
      const topRowCell = cellsfield.find((cell) => cell.row === topRowNumber
          && cell.line === currentline && cell.content.length === 0);
      const bottomRowCell = cellsfield.find((cell) => cell.row === bottomRowNumber
          && cell.line === currentline && cell.content.length === 0);
      setMoveCells([topRowCell?.id, bottomRowCell?.id]);
      dispatch(battleActions.addAnimation({ cell: topRowCell, type: 'green' }));
      dispatch(battleActions.addAnimation({ cell: bottomRowCell, type: 'green' }));
      const currentCell = cellsfield.find((cell) => cell.id === aimCard.cellId);
      const movingCard = currentCell.content.find((item) => item.type === 'warrior');
      dispatch(battleActions.addActiveCard({ card: movingCard, player: thisPlayer }));
    } else if (name === 'stun') {
      const currentTurn = aimCard?.turn;
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
    } else if (name === 'heal') {
      const spellPower = findDependValue(feature);
      const newHealth = (aimCard.currentHP + spellPower) >= aimCard.health
        ? aimCard.health : aimCard.currentHP + spellPower;
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: aimCard.id,
        cellId: aimCard.cellId,
      }));
    } else if (name === 'enemyheroheal') {
      const enemyPlayer = player === 'player1' ? 'player2' : 'player1';
      const heroCard = fieldCells
        .find((cell) => cell.type === 'hero' && cell.player === enemyPlayer)
        .content.find((el) => el.type === 'hero');
      const newHealth = (heroCard.currentHP + feature.value) >= heroCard.health
        ? heroCard.health : heroCard.currentHP + feature.value;
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: heroCard.id,
        cellId: heroCard.cellId,
      }));
    } else if (name === 'heroheal') {
      const heroCard = fieldCells
        .find((cell) => cell.type === 'hero' && cell.player === thisPlayer)
        .content.find((el) => el.type === 'hero');
      const newHealth = (heroCard.currentHP + feature.value) >= heroCard.health
        ? heroCard.health : heroCard.currentHP + feature.value;
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: heroCard.id,
        cellId: heroCard.cellId,
      }));
    } else if (name === 'health') {
      const newHealth = aimCard.currentHP + findDependValue(feature);
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: aimCard.id,
        cellId: aimCard.cellId,
      }));
    } else if (name === 'invoke') {
      dispatch(battleActions.addActiveCard({ card: value, player: thisPlayer }));
      handleAnimation(value, 'add');
    }
  };

  const findAdjsentLine = (num, direct) => {
    if (num === '1') {
      return direct === 'right' ? '3' : '2';
    }
    if (num === '2') {
      return direct === 'right' ? '1' : null;
    }
    if (num === '3') {
      return direct === 'right' ? '4' : '1';
    }
    return direct === 'right' ? null : '3';
  };

  const makeFeatureCast = (feature, aimCell, applyingCard) => {
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const newAimCell = newfieldCells.find((cell) => cell.id === aimCell.id);
    const aimCard = applyingCard ?? newAimCell.content.find((item) => item.type === 'warrior' || item.type === 'hero');
    const {
      type, aim, charges, id,
    } = feature;
    if (aim.includes('field')) {
      if (type === 'all') {
        fieldCells
          .filter((cell) => cell.content.length !== 0 && cell.type === 'field')
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior' && aim.includes(item.subtype));
            if (warriorCard) {
              applySpellEffect(feature, warriorCard, cell, newfieldCells);
            }
          });
      }
    } else if (aim.includes('line')) {
      const { line } = aimCell;
      fieldCells
        .filter((cell) => cell.line === line && cell.content.length !== 0 && cell.type === 'field')
        .forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          applySpellEffect(feature, warriorCard, cell, newfieldCells);
        });
    } else if (aim.includes('row')) {
      if (type === 'all') {
        const { row } = aimCell;
        fieldCells
          .filter((cell) => cell.row === row && cell.content.length !== 0 && cell.type === 'field')
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior');
            applySpellEffect(feature, warriorCard, cell, newfieldCells);
          });
      }
      if (type === 'bad') {
        const { row } = aimCell;
        fieldCells
          .filter((cell) => cell.row === row && cell.content.length !== 0
            && cell.type === 'field' && cell.player !== thisPlayer)
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior');
            console.log(feature);
            applySpellEffect(feature, warriorCard, cell, newfieldCells);
          });
      }
    } else if (aim.includes('nextrow')) {
      if (type === 'bad') {
        const currentRowNumber = parseInt(aimCell.row, 10);
        const topRowNumber = (currentRowNumber - 1).toString();
        const bottomRowNumber = (currentRowNumber + 1).toString();
        const topRowCells = newfieldCells.filter((cell) => cell.row === topRowNumber
          && cell.content.length !== 0 && cell.player !== thisPlayer && cell.type === 'field');
        const bottomRowCells = newfieldCells.filter((cell) => cell.row === bottomRowNumber
          && cell.content.length !== 0 && cell.player !== thisPlayer && cell.type === 'field');
        const allRowCells = [topRowCells, bottomRowCells];
        console.log(topRowCells);
        console.log(bottomRowCells);
        const choosenRowCells = topRowCells.length !== 0 && bottomRowCells.length !== 0
          ? allRowCells[getRandomIndex(2)] : [...topRowCells, ...bottomRowCells];
        console.log(choosenRowCells);
        choosenRowCells.forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          applySpellEffect(feature, warriorCard, cell, newfieldCells);
        });
      }
    } else if (aim.includes('adjacent')) {
      const rowNumber = parseInt(aimCell.row, 10);
      const lineNumber = aimCell.line;
      const topRowNum = (rowNumber + 1).toString();
      const botRowNum = (rowNumber - 1).toString();
      const rightLineNum = findAdjsentLine(lineNumber, 'right');
      const leftLineNum = findAdjsentLine(lineNumber, 'left');
      fieldCells
        .filter((cell) => (((cell.row === topRowNum || cell.row === botRowNum)
          && cell.line === lineNumber)
          || (cell.row === aimCell.row && (cell.line === rightLineNum || cell.line === leftLineNum))) && cell.content.length !== 0 && cell.type === 'field')
        .forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          applySpellEffect(feature, warriorCard, cell, newfieldCells);
        });
    } else {
      applySpellEffect(feature, aimCard, aimCell, newfieldCells);
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
      name, type, aim, attach,
    } = feature;
    const enemyPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    if (attach.includes('spells')) {
      const cellIds = fieldCells
        .filter((cell) => spellsCells.includes(cell.type))
        .map((cell) => cell.id);
      cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
    }
    if (attach.includes('field') && type === 'all') {
      if (attach.includes('warrior')) {
        const cellIds = fieldCells
          .filter((cell) => cell.type === 'field')
          .map((cell) => cell.id);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (attach.includes('hero')) {
        const heroCellsIds = fieldCells.filter((cell) => cell.type === 'hero').map((cell) => cell.id);
        heroCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
    } else if (attach.includes('field') && type === 'good') {
      if (attach.includes('warrior')) {
        const cellIds = getPlayerCellIds(thisPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (attach.includes('hero')) {
        const heroCell = fieldCells.find((cell) => cell.player === thisPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId: heroCell.id, feature, type: 'cell' }));
      }
    } else if (attach.includes('field') && type === 'bad') {
      if (attach.includes('warrior')) {
        const cellIds = getPlayerCellIds(enemyPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (attach.includes('hero')) {
        const heroCell = fieldCells.find((cell) => cell.player === enemyPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId: heroCell.id, feature, type: 'cell' }));
      }
    } else if (attach.includes('row')) {
      if (type === 'all') {
        const rowCellsIds = fieldCells
          .filter((cell) => cell.row === aimCell.row)
          .map((cell) => cell.id);
        rowCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (type === 'bad') {
        const rowCellsIds = fieldCells
          .filter((cell) => cell.row === aimCell.row && cell.player === enemyPlayer)
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
    const { type } = card;
    const cardCell = fieldCells.find((cell) => cell.id === card.cellId);
    const lastSpells = type === 'warrior' ? findTriggerSpells(card, cardCell, 'lastcall', 'warrior') : findTriggerSpells(card, cardCell, 'lastcall', 'spell');
    if (lastSpells && destination === 'grave') {
      lastSpells.forEach((spell) => makeFeatureCast(spell, cardCell, card));
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
      findSpell,
      findOnAttack,
      findTriggerSpells,
      getProtectionVal,
    }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};

export default AbilitiesContext;
