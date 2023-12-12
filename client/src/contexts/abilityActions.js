import {
  useContext, createContext, useState,
} from 'react';
import useSound from 'use-sound';
import { useDispatch, useSelector, useStore } from 'react-redux';
import drumAudio from '../assets/DrumBeat.mp3';
import { maxActionPoints, minCardTurn, maxCardTurn } from '../gameData/gameLimits';
import { spellsCells } from '../gameData/heroes&spellsCellsData';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import findNextRows from '../utils/findNextRowCells';
import getProtectionVal from '../utils/getProtectionVal';
import findTriggerSpells from '../utils/findTriggerSpells';
import functionContext from './functionsContext.js';
import findAdjasentCells from '../utils/findAdjasentCells';
import socket from '../socket';

// const getRandomIndex = (range) => Math.floor(Math.random() * range);

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
    changeTutorStep,
    deleteOtherActiveCard,
  } = useContext(functionContext);
  const store = useStore();
  const [play] = useSound(drumAudio, { volume: 0.3 });
  const [cellData, setCellData] = useState({});
  const [actionPerforming, setActionPerforming] = useState(false);
  const [invoking, setInvoking] = useState(false);

  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);

  const {
    fieldCells, playerPoints, activeCardPlayer1, activeCardPlayer2,
  } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();

  const checkVictory = (card) => {
    if (card.type === 'hero') {
      const winPlayer = card.player === 'player1' ? 'player2' : 'player1';
      dispatch(modalsActions.openModal({ type: 'victory', player: winPlayer, roomId: curRoom }));
    }
  };

  const makeTurn = (direction, card) => {
    const { id, cellId } = card;
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const cell = newfieldCells.find((item) => item.id === cellId);
    const currentCard = cell.content.find((item) => item.id === id);
    const currentTurn = currentCard.turn;
    if (direction === 'turnLeft' && currentTurn < maxCardTurn) {
      dispatch(battleActions.turnCardLeft({ cardId: id, cellId, qty: 1 }));
    } else if (currentTurn > minCardTurn) {
      dispatch(battleActions.turnCardRight({ cardId: id, cellId, qty: 1 }));
    }
  };

  const getPlayerCellIds = (player) => fieldCells.reduce((acc, cell) => {
    if (cell.type === 'field' && cell.player === player) {
      acc = [...acc, cell.id];
    }
    return acc;
  }, []);

  const getEnemyPlayer = (player) => (player === 'player1' ? 'player2' : 'player1');

  const findClosestWarrior = (cells, aimCell) => {
    const enemy = aimCell.player === 'player1' ? 'player2' : 'player1';
    const filteredCells = cells.filter((cell) => cell.player === enemy
   && cell.row === aimCell.row && cell.content.length !== 0 && cell.type === 'field');
    if (filteredCells.length === 1) {
      return filteredCells[0];
    }
    if (filteredCells.length > 1) {
      const targetLine = enemy === 'player2' ? '3' : '1';
      return filteredCells.find((cell) => cell.line === targetLine);
    }
    return null;
  };

  const findSpell = (attacking, protecting, attackType, name) => {
    const newFieldCells = store.getState().battleReducer.fieldCells;
    const protectingCell = newFieldCells.find((cell) => cell.id === protecting.cellId);
    console.log(protectingCell);
    const cardAttachSpell = protecting.attachments.find((spell) => spell.name === name
      && spell.aim.includes(attackType));
    const cardFeatureSpell = protecting.features.find((spell) => spell.name === name
    && spell.aim.includes(attackType));
    const cellAttachSpell = protectingCell.attachments.find((spell) => spell.name === name
      && spell.aim.includes(attackType));
    const canUseCellAttach = cellAttachSpell
      && checkMeetCondition(attacking, protecting, cellAttachSpell, attackType);
    const canUseCardAttach = cardAttachSpell
      && checkMeetCondition(attacking, protecting, cardAttachSpell, attackType);
    const canUseCardFeature = cardFeatureSpell
      && checkMeetCondition(attacking, protecting, cardFeatureSpell, attackType);
    if (canUseCardAttach) {
      return cardAttachSpell;
    }
    if (canUseCellAttach) {
      return cellAttachSpell;
    }
    if (canUseCardFeature) {
      return cardFeatureSpell;
    }
    return null;
  };

  const deleteImmediateSpells = () => {
    fieldCells
      .filter((cell) => cell.content.length !== 0 && cell.type === 'field')
      .forEach((cell) => {
        const warrior = cell.content.find((item) => item.type === 'warrior');
        const immediate = warrior.attachments.find((spell) => spell.immediate);
        if (immediate) {
          dispatch(battleActions.deleteAttachment({ spellId: immediate.id }));
        }
      });
  };

  // MAKE CARD ATTACK

  const makeCardAttack = (cast, attackedCard, castPlayer, castFunc) => {
    const receivedHealth = attackedCard.currentHP;
    const spellPower = findDependValue(cast, castPlayer);
    const protection = findSpell(cast, attackedCard, 'spell', 'protection');
    const protectionVal = protection
      ? getProtectionVal(spellPower, protection, receivedHealth) : 0;
    const calculatedPower = spellPower - protectionVal > 0 ? spellPower - protectionVal : 0;
    if (isKilled(calculatedPower, receivedHealth)) {
      const cardCell = fieldCells.find((cell) => cell.id === attackedCard.cellId);
      const lastSpells = findTriggerSpells(attackedCard, cardCell, 'lastcall', 'warrior');
      deleteCardfromSource(attackedCard);
      dispatch(battleActions.addToGraveyard({ card: attackedCard }));
      moveAttachedSpells(attackedCard.cellId, null, 'kill');
      lastSpells.forEach((feat) => castFunc(feat, cardCell, null, attackedCard.player));
      checkVictory(attackedCard);
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

  // APPLY SPELL EFFECT

  const applySpellEffect = (
    feature,
    aimCard,
    applyingCell,
    cellsfield,
    castingPlayer,
    castFunc,
  ) => {
    if (gameMode === 'tutorial') {
      changeTutorStep((prev) => prev + 1);
    }

    const {
      value, aim, name,
    } = feature;
    const { turn } = aimCard ?? { turn: 0 };
    if (name === 'attack') {
      dispatch(battleActions.addAnimation({ cell: applyingCell, type: 'attacked' }));
      makeCardAttack(feature, aimCard, castingPlayer, castFunc);
    } else if (name === 'selfheroattack') {
      const heroCell = cellsfield.find((cell) => cell.type === 'hero' && cell.player === castingPlayer);
      const heroCard = heroCell.content.find((el) => el.type === 'hero');
      const receivedHealth = heroCard.currentHP;
      if (value === 'power') {
        const attackingPower = getWarriorPower(aimCard);
        dispatch(battleActions.addAnimation({ cell: heroCell, type: 'attacked' }));
        changeCardHP(attackingPower, receivedHealth, heroCard);
      }
    } else if (name === 'moverow' && aimCard?.status === 'field') {
      const { topRowCell, bottomRowCell } = findNextRows(applyingCell, cellsfield);
      setMoveCells([topRowCell?.id, bottomRowCell?.id]);
      dispatch(battleActions.addAnimation({ cell: topRowCell, type: 'green' }));
      dispatch(battleActions.addAnimation({ cell: bottomRowCell, type: 'green' }));
      const currentCell = cellsfield.find((cell) => cell.id === aimCard.cellId);
      const movingCard = currentCell.content.find((item) => item.type === 'warrior');
      dispatch(battleActions.addActiveCard({ card: movingCard, player: castingPlayer }));
    } else if (name === 'evade') {
      const { topRowCell, bottomRowCell } = findNextRows(applyingCell, cellsfield);
      const choosenCell = topRowCell ?? bottomRowCell;
      const turnQty = turn === 0 ? 2 : 1;
      deleteCardfromSource(aimCard);
      dispatch(battleActions.addFieldContent({ card: aimCard, id: choosenCell.id }));
      dispatch(battleActions.turnCardLeft({
        cardId: aimCard.id,
        cellId: choosenCell.id,
        qty: turnQty,
      }));
      moveAttachedSpells(aimCard.cellId, choosenCell.id, 'move');
      setCellData({
        id: choosenCell.id, content: 1, source: aimCard.status, type: aimCard.type,
      });
    } else if (name === 'stun' && aimCard?.status === 'field') {
      const newTurn = turn === 0 ? 2 : 1;
      dispatch(battleActions.turnCardLeft({
        cardId: aimCard.id,
        cellId: aimCard.cellId,
        qty: newTurn,
      }));
    } else if (name === 'return') {
      if (aim.includes('warrior') && aimCard.type === 'warrior') {
        handleAnimation(aimCard, 'delete');
        moveAttachedSpells(aimCard.cellId, null, 'return');
        deleteCardfromSource(aimCard);
        dispatch(battleActions.returnCard({ card: aimCard, cost: aimCard.cost }));
        dispatch(battleActions.deleteActiveCard({ player: aimCard.player }));
      }
    } else if (name === 'heal' && aimCard?.status === 'field') {
      const spellPower = findDependValue(feature, castingPlayer);
      const newHealth = (aimCard.currentHP + spellPower) >= aimCard.health
        ? aimCard.health : aimCard.currentHP + spellPower;
      dispatch(battleActions.addAnimation({ cell: applyingCell, type: 'healed' }));
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: aimCard.id,
        cellId: aimCard.cellId,
      }));
    } else if (name === 'enemyheroheal') {
      const enemyPlayer = castingPlayer === 'player1' ? 'player2' : 'player1';
      const heroCell = cellsfield.find((cell) => cell.type === 'hero' && cell.player === enemyPlayer);
      const heroCard = heroCell.content.find((el) => el.type === 'hero');
      const newHealth = (heroCard.currentHP + feature.value) >= heroCard.health
        ? heroCard.health : heroCard.currentHP + feature.value;
      dispatch(battleActions.addAnimation({ cell: heroCell, type: 'healed' }));
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: heroCard.id,
        cellId: heroCard.cellId,
      }));
    } else if (name === 'heroheal') {
      const heroCell = cellsfield.find((cell) => cell.type === 'hero' && cell.player === castingPlayer);
      const heroCard = heroCell.content.find((el) => el.type === 'hero');
      const newHealth = (heroCard.currentHP + feature.value) >= heroCard.health
        ? heroCard.health : heroCard.currentHP + feature.value;
      dispatch(battleActions.addAnimation({ cell: heroCell, type: 'healed' }));
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: heroCard.id,
        cellId: heroCard.cellId,
      }));
    } else if (name === 'health' && aimCard?.status === 'field') {
      const newHealth = aimCard.currentHP + findDependValue(feature, castingPlayer);
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: aimCard.id,
        cellId: aimCard.cellId,
      }));
    } else if (name === 'invoke') {
      const spellCard = { ...value, player: castingPlayer };
      dispatch(battleActions.addActiveCard({ card: spellCard, player: castingPlayer }));
      handleAnimation(spellCard, 'add');
      setInvoking(true);
      setTimeout(() => setInvoking(false), 1000);
    } else if (name === 'drawcard') {
      dispatch(battleActions.drawCard({ player: castingPlayer }));
    } else if (name === 'increasepoints') {
      const currentPoints = playerPoints.find((item) => item.player === castingPlayer).points;
      const newPoints = currentPoints + value;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player: castingPlayer }));
    }
  };

  // MAKE FEATURE CAST

  const makeFeatureCast = (feature, aimCell, applyingCard, player) => {
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const newAimCell = newfieldCells.find((cell) => cell.id === aimCell?.id);
    const aimCard = applyingCard ?? newAimCell?.content?.find((item) => item.type === 'warrior' || item.type === 'hero');
    const {
      type, aim, charges, id, name,
    } = feature;
    if (aim.includes('field')) {
      if (type === 'all') {
        newfieldCells
          .filter((cell) => cell.content.length !== 0 && cell.type === 'field')
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior' && aim.includes(item.subtype));
            if (warriorCard) {
              applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
            }
          });
      }
    } else if (aim.includes('line')) {
      const { line } = aimCell;
      newfieldCells
        .filter((cell) => cell.line === line && cell.content.length !== 0 && cell.type === 'field')
        .forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          if (warriorCard) {
            applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
          }
        });
    } else if (aim.includes('row')) {
      if (type === 'all') {
        const { row } = aimCell;
        newfieldCells
          .filter((cell) => cell.row === row && cell.content.length !== 0 && cell.type === 'field')
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior');
            if (warriorCard) {
              applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
            }
          });
      }
      if (type === 'bad') {
        const { row } = aimCell;
        newfieldCells
          .filter((cell) => cell.row === row && cell.content.length !== 0
            && cell.type === 'field' && cell.player !== player)
          .forEach((cell) => {
            const warriorCard = cell.content.find((item) => item.type === 'warrior');
            if (warriorCard) {
              applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
            }
          });
      }
    } else if (aim.includes('randomnextrow')) {
      if (type === 'bad') {
        const currentRowNumber = parseInt(aimCell.row, 10);
        const topRowNumber = (currentRowNumber - 1).toString();
        const bottomRowNumber = (currentRowNumber + 1).toString();
        const topRowCells = newfieldCells.filter((cell) => cell.row === topRowNumber
          && cell.content.length !== 0 && cell.player !== player && cell.type === 'field');
        const bottomRowCells = newfieldCells.filter((cell) => cell.row === bottomRowNumber
          && cell.content.length !== 0 && cell.player !== player && cell.type === 'field');
        const choosenRowCells = topRowCells.length !== 0 ? topRowCells : bottomRowCells;
        choosenRowCells.forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
        });
      }
    } else if (aim.includes('nextrowcell')) {
      if (type === 'bad') {
        const foundCell = newfieldCells.find((cell) => cell.player === aimCell.player && cell.type === 'field'
          && cell.row === aimCell.row && cell.content.length !== 0 && cell.line !== aimCell.line);
        if (foundCell) {
          const warrior = foundCell.content.find((el) => el.type === 'warrior');
          applySpellEffect(feature, warrior, foundCell, newfieldCells, player, makeFeatureCast);
        }
      }
    } else if (aim.includes('enemyrowcell')) {
      const foundCell = findClosestWarrior(newfieldCells, aimCell);
      if (foundCell) {
        const warrior = foundCell.content.find((el) => el.type === 'warrior');
        applySpellEffect(feature, warrior, foundCell, newfieldCells, player, makeFeatureCast);
      }
    } else if (aim.includes('allyrowcell')) {
      const foundCell = newfieldCells.find((cell) => cell.player === aimCell.player && cell.type === 'field'
        && cell.row === aimCell.row && cell.content.length !== 0 && cell.id !== aimCell.id);
      if (foundCell) {
        const warrior = foundCell.content.find((el) => el.type === 'warrior');
        applySpellEffect(feature, warrior, foundCell, newfieldCells, player, makeFeatureCast);
      }
    } else if (aim.includes('nextcells')) {
      const currentRowNumber = parseInt(aimCell.row, 10);
      const currentLine = aimCell.line;
      const topRow = (currentRowNumber - 1).toString();
      const botRow = (currentRowNumber + 1).toString();
      const nextCells = newfieldCells.filter((cell) => (cell.row === topRow || cell.row === botRow)
        && cell.line === currentLine && cell.content.length !== 0 && cell.player === player && cell.type === 'field');
      const filteredCells = name === 'heal' ? nextCells.filter((cell) => {
        const warCard = cell.content.find((el) => el.type === 'warrior');
        return warCard.health > warCard.currentHP;
      }) : nextCells;
      filteredCells.forEach((cell) => {
        const warriorCard = cell.content.find((el) => el.type === 'warrior');
        applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
      });
    } else if (aim.includes('adjacent')) {
      if (type === 'all') {
        const adjasCells = findAdjasentCells(aimCell, newfieldCells)
          .filter((cell) => cell.content.length !== 0);
        adjasCells.forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          if (warriorCard) {
            applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
          }
        });
      }
      if (type === 'good') {
        const adjasCells = findAdjasentCells(aimCell, newfieldCells)
          .filter((cell) => cell.content.length !== 0
          && cell.player === player);
        adjasCells.forEach((cell) => {
          const warriorCard = cell.content.find((item) => item.type === 'warrior');
          if (warriorCard) {
            applySpellEffect(feature, warriorCard, cell, newfieldCells, player, makeFeatureCast);
          }
        });
      }
    } else if (aim.includes('oneadjacent')) {
      const adjasentCells = findAdjasentCells(aimCell, newfieldCells)
        .filter((cell) => cell.content.length !== 0);
      const filteredCells = name === 'heal' ? adjasentCells.filter((cell) => {
        const warCard = cell.content.find((el) => el.type === 'warrior');
        return warCard.health > warCard.currentHP;
      }) : adjasentCells;
      if (filteredCells.length !== 0) {
        const chosenCell = filteredCells[0];
        const warriorCard = chosenCell.content.find((item) => item.type === 'warrior');
        applySpellEffect(feature, warriorCard, chosenCell, newfieldCells, player, makeFeatureCast);
      }
    } else {
      applySpellEffect(feature, aimCard, aimCell, newfieldCells, player, makeFeatureCast);
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

  // MAKE FEATURE ATTACH

  const makeFeatureAttach = (feature, aimCell, castingPlayer) => {
    const currentfieldCells = store.getState().battleReducer.fieldCells;
    const currentAimCell = currentfieldCells.find((cell) => cell.id === aimCell?.id);
    const aimCard = currentAimCell?.content?.find((item) => item.type === 'warrior' || item.type === 'hero');
    const {
      name, type, attach,
    } = feature;
    const enemyPlayer = getEnemyPlayer(castingPlayer);
    if (attach.includes('spells')) {
      const cellIds = currentfieldCells
        .filter((cell) => spellsCells.includes(cell.type))
        .map((cell) => cell.id);
      cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
    }
    if (attach.includes('field') && type === 'all') {
      if (attach.includes('warrior')) {
        const cellIds = currentfieldCells
          .filter((cell) => cell.type === 'field')
          .map((cell) => cell.id);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (attach.includes('hero')) {
        const heroCellsIds = currentfieldCells.filter((cell) => cell.type === 'hero').map((cell) => cell.id);
        heroCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
    } else if (attach.includes('field') && type === 'good') {
      if (attach.includes('warrior')) {
        const cellIds = getPlayerCellIds(castingPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (attach.includes('hero')) {
        const heroCell = currentfieldCells.find((cell) => cell.player === castingPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId: heroCell.id, feature, type: 'cell' }));
      }
    } else if (attach.includes('field') && type === 'bad') {
      if (attach.includes('warrior')) {
        const cellIds = getPlayerCellIds(enemyPlayer);
        cellIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (attach.includes('hero')) {
        const heroCell = currentfieldCells.find((cell) => cell.player === enemyPlayer && cell.type === 'hero');
        dispatch(battleActions.addAttachment({ cellId: heroCell.id, feature, type: 'cell' }));
      }
    } else if (attach.includes('row')) {
      if (type === 'all') {
        const rowCellsIds = currentfieldCells
          .filter((cell) => cell.row === aimCell.row)
          .map((cell) => cell.id);
        rowCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (type === 'bad') {
        const rowCellsIds = currentfieldCells
          .filter((cell) => cell.row === aimCell.row && cell.player === enemyPlayer)
          .map((cell) => cell.id);
        rowCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
      if (type === 'good') {
        const rowCellsIds = currentfieldCells
          .filter((cell) => cell.row === aimCell.row && cell.player === castingPlayer)
          .map((cell) => cell.id);
        console.log(rowCellsIds);
        rowCellsIds.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
      }
    } else if (attach.includes('adjacent')) {
      if (type === 'good') {
        const adjacentCells = findAdjasentCells(aimCell, currentfieldCells);
        const filtered = adjacentCells
          .filter((cell) => cell.player === castingPlayer)
          .map((cell) => cell.id);
        filtered.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature })));
      }
    } else if (attach.includes('nextcells')) {
      const adjacentCells = findAdjasentCells(aimCell, currentfieldCells);
      const filtered = adjacentCells
        .filter((cell) => cell.line === aimCell.line)
        .map((cell) => cell.id);
      filtered.forEach((id) => dispatch(battleActions.addAttachment({ cellId: id, feature, type: 'cell' })));
    } else if (attach.includes('grave')) {
      if (type === 'good') {
        const cellId = fieldCells
          .find((cell) => cell.type === 'graveyard' && cell.player === castingPlayer).id;
        dispatch(battleActions.addAttachment({ cellId, feature, type: 'cell' }));
        dispatch(modalsActions.openModal({ type: 'openGraveyard', player: castingPlayer }));
      }
    } else if (name === 'moving') {
      dispatch(battleActions.addAttachment({ cellId: aimCell.id, feature }));
      const newfieldCells = store.getState().battleReducer.fieldCells;
      const currentCell = newfieldCells.find((cell) => cell.id === aimCard.cellId);
      const movingCard = currentCell.content.find((item) => item.type === 'warrior');
      dispatch(battleActions.addActiveCard({ card: movingCard, player: castingPlayer }));
      handleAnimation(movingCard, 'add');
    } else if (name === 'moverow' && aimCard?.status === 'field') {
      dispatch(battleActions.addAttachment({ cellId: aimCell.id, feature }));
      const newfieldCells = store.getState().battleReducer.fieldCells;
      const { topRowCell, bottomRowCell } = findNextRows(aimCell, newfieldCells);
      setMoveCells([topRowCell?.id, bottomRowCell?.id]);
      dispatch(battleActions.addAnimation({ cell: topRowCell, type: 'green' }));
      dispatch(battleActions.addAnimation({ cell: bottomRowCell, type: 'green' }));
      const currentCell = newfieldCells.find((cell) => cell.id === aimCard.cellId);
      const movingCard = currentCell.content.find((item) => item.type === 'warrior');
      dispatch(battleActions.addActiveCard({ card: movingCard, player: castingPlayer }));
    } else if (attach.includes('warrior') || attach.includes('hero')) {
      dispatch(battleActions.addAttachment({ cellId: aimCell.id, feature }));
    }
  };

  const sendCardFromField = (card, destination, cardCost) => {
    const { type } = card;
    const cardCell = fieldCells.find((cell) => cell.id === card.cellId);
    const lastSpells = type === 'warrior' ? findTriggerSpells(card, cardCell, 'lastcall', 'warrior') : findTriggerSpells(card, cardCell, 'lastcall', 'spell');
    if (lastSpells && destination === 'grave') {
      lastSpells.forEach((spell) => makeFeatureCast(spell, cardCell, card, card.player));
    }
    if (type === 'spell') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
    deleteCardfromSource(card);
    if (destination === 'grave') {
      dispatch(battleActions.addToGraveyard({ card }));
    } else {
      const cost = cardCost ?? card.cost;
      dispatch(battleActions.returnCard({ card, cost }));
    }
  };

  const makeFight = (actionData) => {
    deleteImmediateSpells();
    const { card1, card2 } = actionData;
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const attackedCell = newfieldCells.find((cell) => cell.id === card2.cellId);
    const attackingCell = newfieldCells.find((cell) => cell.id === card1.cellId);

    const makeCounterStrike = (
      strikeCard,
      recieveCard,
      retaliate,
      attachretaliate,
    ) => {
      dispatch(battleActions.addAnimation({ cell: attackedCell, type: 'makeattack' }));
      const strikePower = retaliate ? getWarriorPower(strikeCard) : 0;
      const attachPower = attachretaliate ? attachretaliate.value : 0;
      const totalStrikePower = strikePower + attachPower;
      const recieveHealth = recieveCard.currentHP;
      const retaliateProtect = findSpell(strikeCard, recieveCard, strikeCard.subtype, 'retaliateProtect');
      const retaliateProtectVal = retaliateProtect
        ? getProtectionVal(totalStrikePower, retaliateProtect, recieveHealth) : 0;
      const calcRetaliatePower = totalStrikePower - retaliateProtectVal > 0
        ? totalStrikePower - retaliateProtectVal : 0;

      if (isKilled(calcRetaliatePower, recieveHealth)) {
        sendCardFromField(recieveCard, 'grave');
        moveAttachedSpells(recieveCard.cellId, null, 'kill');
      } else {
        changeCardHP(calcRetaliatePower, recieveHealth, recieveCard);
      }
      const powerSpells = strikeCard.attachments.filter((spell) => spell.name === 'power');
      powerSpells.forEach((spell) => {
        if (spell.charges === 1) {
          const spellCard = fieldCells.reduce((acc, cell) => {
            const searchingCard = cell.content.find((el) => el.id === spell.id);
            if (searchingCard) {
              acc = searchingCard;
            }
            return acc;
          }, null);
          if (spellCard) {
            sendCardFromField(spellCard, 'grave');
          } else {
            dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
          }
        }
      });
    };

    if (gameMode === 'tutorial' && card1.player === 'player1') {
      changeTutorStep((prev) => prev + 1);
    }

    handleAnimation(card1, 'delete');
    const onAttackSpells = findTriggerSpells(card1, attackedCell, 'onattack', 'warrior');

    onAttackSpells.forEach((spell) => {
      if (spell.apply === 'attacked') {
        makeFeatureCast(spell, attackedCell, null, card2.player);
      } else {
        makeFeatureCast(spell, attackingCell, null, card1.player);
      }
    });

    dispatch(battleActions.deleteActiveCard({ player: card1.player }));
    dispatch(battleActions.turnCardLeft({
      cardId: card1.id,
      cellId: card1.cellId,
      qty: 1,
    }));

    dispatch(battleActions.addAnimation({ cell: attackingCell, type: 'makeattack' }));
    const evade = findSpell(card1, card2, 'warrior', 'evade');
    if (evade) {
      makeFeatureCast(evade, attackedCell, card2, card2.player);
      return;
    }

    dispatch(battleActions.addAnimation({ cell: attackedCell, type: 'attacked' }));

    const attackingInitPower = getWarriorPower(card1);
    const attackingPowerFeature = card1.features.find((feat) => feat.name === 'power' && feat.aim.includes(card2.subtype));
    const attackingAddPower = attackingPowerFeature?.value || 0;
    const attackingPower = attackingInitPower + attackingAddPower;
    const attackedHealth = card2.currentHP;
    const protection = findSpell(card1, card2, card1.subtype, 'protection');
    const protectionVal = protection
      ? getProtectionVal(attackingPower, protection, attackedHealth) : 0;

    const retaliateAttachFeature = findSpell(card1, card2, card1.subtype, 'retaliation');
    const retaliateStrike = findSpell(card1, card2, card1.subtype, 'retaliatestrike');
    const canRetaliate = card2.subtype !== 'shooter' && card2.type !== 'hero' && card1.subtype !== 'shooter';

    const calculatedPower = attackingPower - protectionVal > 0
      ? attackingPower - protectionVal : 0;

    const powerSpells = card1.attachments.filter((spell) => spell.name === 'power');
    powerSpells.forEach((spell) => {
      if (spell.charges === 1) {
        const spellCard = newfieldCells.reduce((acc, cell) => {
          const searchingCard = cell.content.find((el) => el.id === spell.id);
          if (searchingCard) {
            acc = searchingCard;
          }
          return acc;
        }, null);
        if (spellCard) {
          sendCardFromField(spellCard, 'grave');
        } else {
          dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
        }
      }
    });

    if (protection && protection.charges === 1) {
      const protectionCard = newfieldCells.reduce((acc, cell) => {
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

    if (isKilled(calculatedPower, attackedHealth)) {
      sendCardFromField(card2, 'grave');
      moveAttachedSpells(card2.cellId, null, 'kill');
      checkVictory(card2);
    } else {
      changeCardHP(calculatedPower, attackedHealth, card2);
      if (canRetaliate || retaliateAttachFeature) {
        makeCounterStrike(card2, card1, canRetaliate, retaliateAttachFeature);
      }
    }

    if (retaliateStrike) {
      makeCounterStrike(card2, card1, null, retaliateStrike);
    }
  };

  // ADD CARD TO FIELD ///////

  const addCardToField = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, points, curCell,
    } = actionData;
    const cellId = curCell.id;
    if (gameMode === 'tutorial') {
      changeTutorStep((prev) => prev + 1);
    }
    if (card.status === 'hand') {
      const newPoints = points - card.currentC;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    }
    handleAnimation(card, 'delete');
    deleteCardfromSource(card);
    dispatch(battleActions.addFieldContent({ card, id: cellId }));
    dispatch(battleActions.deleteActiveCard({ player }));
    if (curCell.type === 'postponed') {
      if (card.type === 'spell' && card.place === 'postponed') {
        card.features.forEach((feature) => makeFeatureAttach(feature, curCell, player));
      }
      return;
    }
    setCellData({
      id: cellId, content: 1, source: card.status, type: card.type,
    });
    if (card.type === 'warrior') {
      if (card.status === 'field') {
        moveAttachedSpells(card.cellId, cellId, 'move');
        const movingAttachment = card.attachments.find((feature) => feature.name === 'moving' || feature.name === 'moverow');
        const hasSwift = card.features.find((feat) => feat.name === 'swift')
            || card.attachments.find((feature) => feature.name === 'swift');
        if (!hasSwift && card.player === player && !movingAttachment) {
          dispatch(battleActions.turnCardLeft({
            cardId: card.id,
            cellId,
            qty: 1,
          }));
        }
        if (movingAttachment && movingAttachment.charges === 1) {
          dispatch(battleActions.deleteAttachment({ spellId: movingAttachment.id }));
        }
      }
      const attachSpells = card.features.filter((feat) => feat.attach);
      attachSpells.forEach((spell) => makeFeatureAttach(spell, curCell, card.player));
    }
    if (card.type === 'spell') {
      card.features
        .forEach((feature) => setTimeout(() => {
          if (!feature.condition && !feature.attach) {
            makeFeatureCast(feature, curCell, null, player);
          } else if (feature.attach) {
            makeFeatureAttach(feature, curCell, player);
          }
        }, 1000));
    }
  };

  // END TURN //////

  const endTurn = (actionData) => {
    deleteImmediateSpells();
    const {
      newPlayer,
      commonPoints,
      newCommonPoints,
      postponedCell,
      temporarySpells,
      turnSpells,
    } = actionData;
    const prevPlayer = newPlayer === 'player1' ? 'player2' : 'player1';
    const currentfieldCells = store.getState().battleReducer.fieldCells;
    if (newPlayer === 'player2') {
      dispatch(battleActions.setPlayerPoints({ points: commonPoints, player: 'player2' }));
    } else {
      if (commonPoints < maxActionPoints) {
        dispatch(battleActions.addCommonPoint());
      }
      dispatch(battleActions.setPlayerPoints({ points: newCommonPoints, player: 'player1' }));
      dispatch(battleActions.setCardSwitchStatus({ player: 'player1', status: false }));
      dispatch(battleActions.setCardSwitchStatus({ player: 'player2', status: false }));
    }
    if (postponedCell.status === 'face') {
      const card = postponedCell.content[0];
      sendCardFromField(card, 'return');
      dispatch(battleActions.deleteActiveCard({ player: prevPlayer }));
      deleteOtherActiveCard(activeCardPlayer1, activeCardPlayer2, prevPlayer);
    }
    if (gameMode === 'hotseat') {
      dispatch(battleActions.changePlayer({ newPlayer }));
    }
    handleAnimation(activeCardPlayer2, 'delete');
    dispatch(battleActions.turnPostponed({ player: newPlayer, status: 'face' }));
    dispatch(battleActions.drawCard({ player: newPlayer }));
    dispatch(battleActions.massTurnCards({ player: newPlayer }));
    dispatch(battleActions.changeTurn({ player: newPlayer }));
    [...turnSpells, ...temporarySpells].forEach((spell) => sendCardFromField(spell, 'grave'));

    currentfieldCells
      .filter((cell) => cell.content.length !== 0 && cell.type === 'field' && cell.player === newPlayer)
      .forEach((cell) => {
        const warrior = cell.content.find((el) => el.type === 'warrior');
        const onTurnStartSpells = findTriggerSpells(warrior, cell, 'onturnstart', 'warrior');
        onTurnStartSpells.forEach((spell) => makeFeatureCast(spell, cell, null, newPlayer));
      });
    play();
  };

  // MAKE CAST SPELL

  const castSpell = async (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, points, cell,
    } = actionData;
    if (card.status === 'hand' || card.type === 'hero') {
      const newPoints = points - card.currentC;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    }
    dispatch(battleActions.deleteActiveCard({ player }));
    const makeCast = async () => {
      await Promise.all(card.features.map((feature) => new Promise((resolve) => {
        setTimeout(() => {
          if (!feature.condition && !feature.attach && feature.name !== 'cantPostpone') {
            makeFeatureCast(feature, cell, null, player);
          } else if (feature.attach) {
            setCellData({
              id: cell.id, content: 1, source: card.status, type: card.type,
            });
            makeFeatureAttach(feature, cell, player);
          }
          resolve();
        }, 500);
      })));
    };

    await makeCast();

    if (card.name !== 'fake' && card.type !== 'hero') {
      deleteCardfromSource(card);
      if (card.subtype === 'instant') {
        dispatch(battleActions.addToGraveyard({ card }));
      } else {
        dispatch(battleActions.addFieldContent({ card, id: cell.id }));
      }
    }
    if (card.type === 'hero') {
      dispatch(battleActions.turnCardLeft({
        cardId: card.id,
        cellId: card.cellId,
        qty: 1,
      }));
    }
  };

  // DRAW START CARDS //////

  const drawCards = (actionData) => {
    deleteImmediateSpells();
    const { player, number } = actionData;
    dispatch(battleActions.setCardDrawStatus({ player, status: true }));
    for (let i = 1; i <= number; i += 1) {
      dispatch(battleActions.drawCard({ player }));
    }
  };

  // RETURN CARD TO HAND

  const returnCardToHand = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, cost, spellId,
    } = actionData;
    if (card.status === 'field') {
      moveAttachedSpells(card.cellId, null, 'return');
    }
    handleAnimation(card, 'delete');
    dispatch(battleActions.deleteActiveCard({ player }));
    deleteOtherActiveCard(activeCardPlayer1, activeCardPlayer2, player);
    sendCardFromField(card, 'return', cost);
    dispatch(battleActions.deleteAttachment({ spellId }));
  };

  // RETURN CARD TO OWNER'S DECK

  const returnCardToDeck = (actionData) => {
    deleteImmediateSpells();
    const { card, player } = actionData;
    handleAnimation(card, 'delete');
    dispatch(battleActions.sendCardtoDeck({ card }));
    deleteCardfromSource(card);
    dispatch(battleActions.deleteActiveCard({ player }));
  };

  // USE CARD ABILITY

  const makeAbilityCast = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, points, cell, ability,
    } = actionData;
    handleAnimation(card, 'delete');
    dispatch(battleActions.deleteActiveCard({ player }));
    const newPoints = points - ability.cost;
    dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    if (!ability.attach) {
      makeFeatureCast(ability, cell, null, player);
    }
    if (ability.attach) {
      makeFeatureAttach(ability, cell, player);
    }
    if (card.type === 'spell') {
      deleteCardfromSource(card);
      dispatch(battleActions.addToGraveyard({ card }));
    } else {
      makeTurn('turnLeft', card);
    }
  };

  // SWITCH CARD

  const switchCard = (actionData) => {
    deleteImmediateSpells();
    const { player } = actionData;
    returnCardToDeck(actionData);
    dispatch(battleActions.drawCard({ player }));
    dispatch(battleActions.setCardSwitchStatus({ player, status: true }));
  };

  // MAKE ONLINE ACTION

  const makeMove = {
    addCardToField: (data) => addCardToField(data),
    endTurn: (data) => endTurn(data),
    castSpell: (data) => castSpell(data),
    makeFight: (data) => makeFight(data),
    drawCards: (data) => drawCards(data),
    switchCard: (data) => switchCard(data),
    returnCardToHand: (data) => returnCardToHand(data),
    returnCardToDeck: (data) => returnCardToDeck(data),
    makeAbilityCast: (data) => makeAbilityCast(data),
    // eslint-disable-next-line
  };

  const chooseAction = {
    error: () => dispatch(modalsActions.openModal({ type: 'connectProblem' })),
    action: (move, actionData) => makeMove[move](actionData),
  };

  const makeOnlineAction = async (actionData) => {
    setActionPerforming(true);
    if (socket.connected) {
      socket.emit('makeMove', actionData, (res) => {
        const { move } = actionData;
        const resType = res.error ? 'error' : 'action';
        chooseAction[resType](move, actionData);
        console.log(resType);
        setActionPerforming(false);
      });
    } else {
      chooseAction.error();
      setActionPerforming(false);
    }
  };

  return (
    <AbilitiesContext.Provider value={{
      makeOnlineAction,
      makeFeatureCast,
      makeFeatureAttach,
      sendCardFromField,
      findSpell,
      findTriggerSpells,
      getProtectionVal,
      makeFight,
      addCardToField,
      endTurn,
      castSpell,
      drawCards,
      returnCardToHand,
      returnCardToDeck,
      makeAbilityCast,
      makeTurn,
      switchCard,
      makeMove,
      cellData,
      actionPerforming,
      invoking,
    }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};

export default AbilitiesContext;
