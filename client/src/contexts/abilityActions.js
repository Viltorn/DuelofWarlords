/* eslint-disable max-len */
import {
  useContext, createContext, useState,
} from 'react';
import useSound from 'use-sound';
import { useDispatch, useSelector, useStore } from 'react-redux';
import drumAudio from '../assets/DrumBeat.mp3';
import { maxActionPoints, maxCardsDeckCopy } from '../gameData/gameLimits';
import { spellsCells } from '../gameData/heroes&spellsCellsData';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as deckbuilderActions } from '../slices/deckbuilderSlice.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer';
import findClosestWarrior from '../utils/supportFunc/findClosestWarrior';
import findNextRowsCells from '../utils/supportFunc/findNextRowCells.js';
import getProtectionVal from '../utils/supportFunc/getProtectionVal.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import functionContext from './functionsContext.js';
import findAdjasentCells from '../utils/supportFunc/findAdjasentCells.js';
import findNextCellsInLine from '../utils/supportFunc/findNextCellsInLine';
import findNextRowToApply from '../utils/supportFunc/findNextRowToApply';
import socket from '../socket';
import isCellEmpty from '../utils/supportFunc/isCellEmpty.js';

// const getRandomIndex = (range) => Math.floor(Math.random() * range);

const AbilitiesContext = createContext({});

export const AbilityProvider = ({ children }) => {
  const {
    isKilled,
    deleteCardfromSource,
    moveAttachedSpells,
    changeCardHP,
    getWarriorPower,
    handleAnimation,
    checkMeetCondition,
    findDependValue,
    changeTutorStep,
    deleteOtherActiveCard,
  } = useContext(functionContext);
  const store = useStore();
  const [play] = useSound(drumAudio, { volume: 0.3 });
  const dispatch = useDispatch();
  // const [cellData, setCellData] = useState({});
  const [actionPerforming, setActionPerforming] = useState(false);
  const [invoking, setInvoking] = useState(false);

  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);

  const {
    fieldCells, playerPoints, activeCardPlayer1, activeCardPlayer2,
  } = useSelector((state) => state.battleReducer);
  const {
    selectedCards,
  } = useSelector((state) => state.deckbuilderReducer);

  const showVictoryWindow = (winPlayer) => dispatch(modalsActions.openModal({ type: 'victory', player: winPlayer, roomId: curRoom }));

  const checkIfIsVictory = (killedcard) => {
    if (killedcard.type === 'hero') {
      const winPlayer = killedcard.player === 'player1' ? 'player2' : 'player1';
      showVictoryWindow(winPlayer);
    }
  };

  // CHANGE CARDS IN DECK

  const changeCardQuantity = (card, value) => {
    const initialQty = card.qty ?? 0;
    const newQty = initialQty + value;
    const newCard = { ...card, qty: newQty };
    const removeCard = newQty === 0 && card.type !== 'hero';
    const removeHero = newQty === 0 && card.type === 'hero';
    const addNewCard = card.qty === 0 && newQty === 1 && card.type !== 'hero';
    const changeCardQty = newQty !== 0 && card.type !== 'hero';
    const addHero = newQty !== 0 && card.type === 'hero';

    if (removeCard) {
      const newSelectedCards = selectedCards.filter((el) => el.description !== card.description);
      dispatch(deckbuilderActions.selectCards({ selectedCards: newSelectedCards }));
    } else if (removeHero) {
      dispatch(deckbuilderActions.selectHero({ selectedHero: null }));
      dispatch(deckbuilderActions.selectCards({ selectedCards: [] }));
    } else if (addNewCard) {
      dispatch(deckbuilderActions.selectCards({ selectedCards: [...selectedCards, newCard] }));
    } else if (changeCardQty) {
      const index = selectedCards.findIndex((el) => el.description === card.description);
      const newSelectedCards = [...selectedCards];
      newSelectedCards[index] = newCard;
      dispatch(deckbuilderActions.selectCards({ selectedCards: newSelectedCards }));
    } else if (addHero) {
      dispatch(deckbuilderActions.selectHero({ selectedHero: newCard }));
    }

    if (removeCard || removeHero || addHero) {
      dispatch(battleActions.deleteActiveCard({ player: 'player1' }));
    }

    if (addNewCard || changeCardQty) {
      dispatch(battleActions.addActiveCard({ card: newCard, player: 'player1' }));
    }
  };

  const changeCardsInDeckBuilder = (card, value) => {
    if (value === 1 && card.qty < maxCardsDeckCopy) {
      changeCardQuantity(card, 1);
      dispatch(deckbuilderActions.setChanges({ changesMade: true }));
    }
    if (value === -1) {
      changeCardQuantity(card, -1);
      dispatch(deckbuilderActions.setChanges({ changesMade: true }));
    }
  };

  // FIND SPELL

  const findSpell = (attackingCard, defendingCard, attackType, spellName, allFieldCells) => {
    const protectingCell = allFieldCells.find((cell) => cell.id === defendingCard.cellId);
    const cardAttachSpell = defendingCard.attachments.find((spell) => spell.name === spellName
      && spell.aim.includes(attackType));
    const cardFeatureSpell = defendingCard.features.find((spell) => spell.name === spellName
    && spell.aim.includes(attackType));
    const cellAttachSpell = protectingCell.attachments.find((spell) => spell.name === spellName
      && spell.aim.includes(attackType));
    const canUseCellAttach = cellAttachSpell
      && checkMeetCondition(attackingCard, defendingCard, cellAttachSpell, attackType, allFieldCells);
    const canUseCardAttach = cardAttachSpell
      && checkMeetCondition(attackingCard, defendingCard, cardAttachSpell, attackType, allFieldCells);
    const canUseCardFeature = cardFeatureSpell
      && checkMeetCondition(attackingCard, defendingCard, cardFeatureSpell, attackType, allFieldCells);
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

  // DELETE IMMIDIATE SPELLS

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

  // SEND CARD FROM THE FIELD

  const sendCardFromField = (data) => {
    const {
      card, castFunc, destination, cardCost, cellsOnField,
    } = data;
    const { type, status } = card;
    const cardCell = cellsOnField.find((cell) => cell.id === card.cellId);
    const lastSpells = type === 'warrior' ? findTriggerSpells(card, cardCell, 'lastcall', 'warrior') : findTriggerSpells(card, cardCell, 'lastcall', 'spell');
    if (lastSpells && destination === 'grave' && status === 'field') {
      lastSpells.forEach((spell) => castFunc(spell, cardCell, card, card.player));
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

  // MAKE CARD ATTACK

  const deleteChargedSpellCard = (spell, allFieldCards, allFieldCells, castFunc) => {
    const spellCardOnField = allFieldCards.find((card) => card.id === spell.id);
    if (spellCardOnField) {
      sendCardFromField({
        card: spellCardOnField,
        castFunc,
        destination: 'grave',
        cardCost: null,
        cellsOnField: allFieldCells,
      });
    } else {
      dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
    }
  };

  const makeSpellCardAttack = (data) => {
    const {
      feature,
      aimCard,
      currentFieldCells,
      currentFieldCards,
      castingPlayer,
      castFunc,
    } = data;
    const receivedHealth = aimCard.currentHP;
    const spellPower = findDependValue(feature, castingPlayer, currentFieldCells, currentFieldCards);
    const protectSpell = findSpell(feature, aimCard, 'spell', 'protection', currentFieldCells);
    const protectionVal = protectSpell
      ? getProtectionVal(spellPower, protectSpell, receivedHealth) : 0;
    const calculatedPower = spellPower - protectionVal > 0 ? spellPower - protectionVal : 0;
    const applyingCell = currentFieldCells.find((cell) => cell.id === aimCard.cellId);

    dispatch(battleActions.addAnimation({ cellId: applyingCell.id, type: 'attacked' }));
    if (isKilled(calculatedPower, receivedHealth)) {
      const cardCell = currentFieldCells.find((cell) => cell.id === aimCard.cellId);
      const lastSpells = findTriggerSpells(aimCard, cardCell, 'lastcall', 'warrior');
      deleteCardfromSource(aimCard);
      dispatch(battleActions.addToGraveyard({ card: aimCard }));
      moveAttachedSpells(aimCard.cellId, null, 'kill');
      lastSpells.forEach((feat) => castFunc(feat, cardCell, null, aimCard.player));
      checkIfIsVictory(aimCard);
    }
    if (!isKilled(calculatedPower, receivedHealth)) {
      changeCardHP(calculatedPower, receivedHealth, aimCard);
    }
    if (!isKilled(calculatedPower, receivedHealth) && protectSpell && protectSpell?.charges === 1) {
      deleteChargedSpellCard(protectSpell, currentFieldCards, currentFieldCells, castFunc);
    }
  };

  // APPLY SPELL EFFECT

  const makeCardHeal = (data, type) => {
    const {
      feature, castingPlayer, currentFieldCards, aimCard, currentFieldCells,
    } = data;
    let appliedCard;
    if (type === 'enemyHeroHeal') {
      const enemyPlayer = castingPlayer === 'player1' ? 'player2' : 'player1';
      appliedCard = currentFieldCards.find((card) => card.type === 'hero' && card.player === enemyPlayer);
    }
    if (type === 'heroHeal') {
      appliedCard = currentFieldCards.find((card) => card.type === 'hero' && card.player === castingPlayer);
    }
    if (type === 'heal') {
      appliedCard = aimCard;
    }
    const spellPower = findDependValue(feature, castingPlayer, currentFieldCells);
    const newHealth = (appliedCard.currentHP + spellPower) >= appliedCard.health
      ? appliedCard.health : appliedCard.currentHP + spellPower;
    dispatch(battleActions.addAnimation({ cellId: appliedCard.cellId, type: 'healed' }));
    dispatch(battleActions.changeHP({
      health: newHealth,
      cardId: appliedCard.id,
    }));
  };

  const performSpellEffect = {
    attack: (data) => {
      makeSpellCardAttack(data);
    },
    selfHeroAttack: (data) => {
      const {
        currentFieldCards, castingPlayer, feature, aimCard,
      } = data;
      const { value } = feature;
      const heroCard = currentFieldCards.find((card) => card.type === 'hero' && card.player === castingPlayer);
      const receivedHealth = heroCard.currentHP;
      if (value === 'power') {
        const attackingPower = getWarriorPower(aimCard);
        dispatch(battleActions.addAnimation({ cellId: heroCard.cellId, type: 'attacked' }));
        changeCardHP(attackingPower, receivedHealth, heroCard);
      }
    },
    evade: (data) => {
      const {
        currentFieldCells, currentFieldCards, aimCard, applyingCell,
      } = data;
      const { topRowCell, bottomRowCell } = findNextRowsCells(applyingCell, currentFieldCells, currentFieldCards);
      const choosenCell = topRowCell ?? bottomRowCell;
      const turnQty = aimCard.turn === 0 ? 2 : 1;
      deleteCardfromSource(aimCard);
      dispatch(battleActions.addFieldContent({ card: aimCard, id: choosenCell.id }));
      dispatch(battleActions.turnCardLeft({
        cardId: aimCard.id,
        qty: turnQty,
      }));
      moveAttachedSpells(aimCard.cellId, choosenCell.id, 'move');
      dispatch(battleActions.setLastCellWithAction({
        cellActionData: {
          id: choosenCell.id, content: 1, source: aimCard.status, type: aimCard.type,
        },
      }));
    },
    stun: (data) => {
      const { aimCard } = data;
      const { turn } = aimCard;
      const newTurn = turn === 0 ? 2 : 1;
      dispatch(battleActions.turnCardLeft({
        cardId: aimCard.id,
        qty: newTurn,
      }));
    },
    return: (data) => {
      const { aimCard, feature } = data;
      if (feature.aim.includes(aimCard.type)) {
        handleAnimation(aimCard, 'delete');
        moveAttachedSpells(aimCard.cellId, null, 'return');
        deleteCardfromSource(aimCard);
        dispatch(battleActions.returnCard({ card: aimCard, cost: aimCard.cost }));
        dispatch(battleActions.deleteActiveCard({ player: aimCard.player }));
      }
    },
    heal: (data) => {
      makeCardHeal(data, 'heal');
    },
    enemyHeroHeal: (data) => {
      makeCardHeal(data, 'enemyHeroHeal');
    },
    heroHeal: (data) => {
      makeCardHeal(data, 'heroHeal');
    },
    health: (data) => {
      const {
        aimCard, feature, castingPlayer, currentFieldCells,
      } = data;
      const newHealth = aimCard
        .currentHP + findDependValue(feature, castingPlayer, currentFieldCells);
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: aimCard.id,
      }));
    },
    invoke: (data) => {
      const { feature, castingPlayer, aimCard } = data;
      const spellCard = { ...feature.value, player: castingPlayer, cellId: aimCard.cellId };
      dispatch(battleActions.addActiveCard({ card: spellCard, player: castingPlayer }));
      handleAnimation(spellCard, 'add');
      setInvoking(true);
      setTimeout(() => setInvoking(false), 1000);
    },
    drawCard: (data) => {
      dispatch(battleActions.drawCard({ player: data.castingPlayer }));
    },
    increasePoints: (data) => {
      const { feature, castingPlayer } = data;
      const currentPoints = playerPoints.find((item) => item.player === castingPlayer).points;
      const newPoints = currentPoints + feature.value;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player: castingPlayer }));
    },
  };

  const applySpellEffect = (data) => {
    if (gameMode === 'tutorial') {
      changeTutorStep((prev) => prev + 1);
    }

    const { feature, aimCard } = data;

    if ((aimCard && feature.aimStatus === aimCard.status) || !feature.aimStatus) {
      performSpellEffect[feature.name](data);
    }
  };

  const applySpellOnWarsInCells = (cells, featAim, actionData) => {
    const { currentFieldCards } = actionData;
    const cellIds = cells.map((cell) => cell.id);
    const cardsToApply = currentFieldCards.filter((card) => cellIds.includes(card.cellId)
    && card.type === 'warrior' && featAim.includes(card.subtype));
    cardsToApply.forEach((card) => applySpellEffect({ ...actionData, aimCard: card }));
  };

  // MAKE FEATURE CAST

  const findCellsForSpellApply = (data) => {
    const {
      feature, aimCell, player, currentFieldCells, currentFieldCards,
    } = data;
    const { type, aim } = feature;
    if (aim.includes('field')) {
      if (type === 'all') {
        return currentFieldCells.filter((cell) => cell.type === 'field');
      }
    } else if (aim.includes('line')) {
      const { line } = aimCell;
      return currentFieldCells.filter((cell) => cell.line === line && !isCellEmpty(currentFieldCards, cell.id) && cell.type === 'field');
    } else if (aim.includes('row')) {
      if (type === 'all') {
        const { row } = aimCell;
        return currentFieldCells.filter((cell) => cell.row === row && !isCellEmpty(currentFieldCards, cell.id) && cell.type === 'field');
      }
      if (type === 'bad') {
        const { row } = aimCell;
        return currentFieldCells
          .filter((cell) => cell.row === row && !isCellEmpty(currentFieldCards, cell.id)
            && cell.type === 'field' && cell.player !== player);
      }
    } else if (aim.includes('randomNextRow')) {
      if (type === 'bad') {
        return findNextRowToApply(aimCell, currentFieldCells, currentFieldCards, player);
      }
    } else if (aim.includes('otherWarInRow')) {
      if (type === 'bad') {
        const foundCell = currentFieldCells.find((cell) => cell.player !== aimCell.player && cell.type === 'field'
          && cell.row === aimCell.row && !isCellEmpty(currentFieldCards, cell.id) && cell.line !== aimCell.line);
        return foundCell ?? [];
      }
    } else if (aim.includes('closestEnemyInRow')) {
      const foundCell = findClosestWarrior(currentFieldCells, currentFieldCards, aimCell);
      return foundCell ?? [];
    } else if (aim.includes('otherAllyInRow')) {
      const foundCell = currentFieldCells.find((cell) => cell.player === aimCell.player && cell.type === 'field'
        && cell.row === aimCell.row && !isCellEmpty(currentFieldCards, cell.id) && cell.id !== aimCell.id);
      return foundCell ?? [];
    } else if (aim.includes('nextWarsInLine')) {
      return findNextCellsInLine(currentFieldCells, currentFieldCards, aimCell);
    } else if (aim.includes('adjacent')) {
      if (type === 'all') {
        return findAdjasentCells(currentFieldCells, aimCell)
          .filter((cell) => !isCellEmpty(currentFieldCards, cell.id));
      }
      if (type === 'good') {
        return findAdjasentCells(currentFieldCells, aimCell)
          .filter((cell) => !isCellEmpty(currentFieldCards, cell.id) && cell.player === player);
      }
    } else if (aim.includes('oneAdjacent')) {
      const adjasentCells = findAdjasentCells(currentFieldCells, aimCell)
        .filter((cell) => !isCellEmpty(currentFieldCards, cell.id));
      return adjasentCells.length !== 0 ? adjasentCells[0] : [];
    }
    return null;
  };

  const makeFeatureCast = (feature, aimCell, applyingCard, player) => {
    const currentFieldCells = store.getState().battleReducer.fieldCells;
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const aimCard = applyingCard ?? currentFieldCards.find((card) => card.cellId === aimCell?.id
    && (card.type === 'warrior' || card.type === 'hero'));
    const cellsToApplyCast = findCellsForSpellApply({
      feature, aimCell, applyingCard, player, currentFieldCells, currentFieldCards,
    });
    if (cellsToApplyCast) {
      applySpellOnWarsInCells(cellsToApplyCast, feature.aim, {
        feature,
        currentFieldCells,
        currentFieldCards,
        castingPlayer: player,
        castFunc: makeFeatureCast,
      });
    } else {
      applySpellEffect({
        feature,
        aimCard,
        currentFieldCells,
        currentFieldCards,
        applyingCell: aimCell,
        castingPlayer: player,
        castFunc: makeFeatureCast,
      });
    }

    if (feature.charges === 1) {
      deleteChargedSpellCard(feature, currentFieldCards, currentFieldCells, makeFeatureCast);
    }
  };

  // MAKE FEATURE ATTACH

  const attachSpellEffect = {
    moving: (data) => {
      const {
        aimCard, castingPlayer, feature,
      } = data;
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
      const newFieldCards = store.getState().battleReducer.fieldCards;
      const newAimCard = newFieldCards.find((card) => card.id === aimCard.id);
      dispatch(battleActions.addActiveCard({ card: newAimCard, player: castingPlayer }));
      handleAnimation(newAimCard, 'add');
    },
    moveNextRow: (data) => {
      const {
        aimCell, aimCard, currentFieldCells, castingPlayer, feature,
      } = data;
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
      const { topRowCell, bottomRowCell } = findNextRowsCells(aimCell, currentFieldCells);
      const newFieldCards = store.getState().battleReducer.fieldCards;
      const newAimCard = newFieldCards.find((card) => card.id === aimCard.id);
      dispatch(battleActions.addActiveCells({ cellsIds: [topRowCell?.id, bottomRowCell?.id], type: 'cellsForWarMove' }));
      dispatch(battleActions.addAnimation({ cellId: topRowCell.id, type: 'green' }));
      dispatch(battleActions.addAnimation({ cellId: bottomRowCell.id, type: 'green' }));
      dispatch(battleActions.addActiveCard({ card: newAimCard, player: castingPlayer }));
    },
  };

  const attachSpellEffectOnCells = (cellsArr, feature) => {
    const cellsIds = cellsArr.map((cell) => cell.id);
    cellsIds.forEach((id) => dispatch(battleActions.addCellAttachment({ cellId: id, feature })));
  };

  const attachSpellEffectOnWar = (data) => {
    const {
      aimCell, feature, castingPlayer, currentFieldCards, currentFieldCells,
    } = data;
    const aimCard = currentFieldCards.find((card) => card.cellId === aimCell.id
    && (card.type === 'warrior' || card.type === 'hero'));
    const { name } = feature;
    if (feature.immediate && aimCard && aimCard.status === feature.aimStatus) {
      attachSpellEffect[name]({
        aimCell, castingPlayer, currentFieldCells, aimCard, feature,
      });
    }
    if (!feature.immediate) {
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
    }
  };

  const findCellsToAttachCast = (data) => {
    const {
      currentFieldCells, feature, castingPlayer, enemyPlayer, aimCell,
    } = data;
    const { type, attach } = feature;
    if (attach.includes('spells')) {
      return currentFieldCells.filter((cell) => spellsCells.includes(cell.type));
    }
    if (attach.includes('field') && type === 'all') {
      return currentFieldCells.filter((cell) => (cell.type === 'field' && attach.includes('warrior'))
        || (cell.type === 'hero' && attach.includes('hero')));
    } if (attach.includes('field') && type === 'good') {
      return currentFieldCells.filter((cell) => cell.player === castingPlayer && ((cell.type === 'field' && attach.includes('warrior'))
        || (cell.type === 'hero' && attach.includes('hero'))));
    } if (attach.includes('field') && type === 'bad') {
      return currentFieldCells.filter((cell) => cell.player === enemyPlayer && ((cell.type === 'field' && attach.includes('warrior'))
      || (cell.type === 'hero' && attach.includes('hero'))));
    } if (attach.includes('row')) {
      if (type === 'all') {
        return currentFieldCells.filter((cell) => cell.row === aimCell.row);
      }
      if (type === 'bad') {
        return currentFieldCells
          .filter((cell) => cell.row === aimCell.row && cell.player === enemyPlayer);
      }
      if (type === 'good') {
        return currentFieldCells
          .filter((cell) => cell.row === aimCell.row && cell.player === castingPlayer);
      }
    } else if (attach.includes('adjacent')) {
      if (type === 'good') {
        const adjacentCells = findAdjasentCells(currentFieldCells, aimCell);
        return adjacentCells.filter((cell) => cell.player === castingPlayer);
      }
    } else if (attach.includes('nextcells')) {
      const adjacentCells = findAdjasentCells(currentFieldCells, aimCell);
      return adjacentCells.filter((cell) => cell.line === aimCell.line);
    } else if (attach.includes('grave')) {
      if (type === 'good') {
        return currentFieldCells.filter((cell) => cell.type === 'graveyard' && cell.player === castingPlayer);
      }
    }
    return null;
  };

  const makeFeatureAttach = (feature, aimCell, castingPlayer) => {
    const currentFieldCells = store.getState().battleReducer.fieldCells;
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const enemyPlayer = getEnemyPlayer(castingPlayer);
    const { attach } = feature;
    const cellsToAttach = findCellsToAttachCast({
      currentFieldCells, currentFieldCards, feature, castingPlayer, enemyPlayer, aimCell,
    });
    if (cellsToAttach) {
      attachSpellEffectOnCells(cellsToAttach, feature);
    }
    if (cellsToAttach && attach.includes('grave')) {
      dispatch(modalsActions.openModal({ type: 'openGraveyard', player: castingPlayer }));
    }
    if (!cellsToAttach && (attach.includes('warrior') || attach.includes('hero'))) {
      attachSpellEffectOnWar({
        aimCell, feature, castingPlayer, currentFieldCards, currentFieldCells,
      });
    }
  };

  // MAKE FIGHT

  const makeCounterStrike = (data) => {
    const {
      strikingCard,
      recievingCard,
      canRetaliate,
      retaliateSpell,
      newfieldCells,
      newfieldCards,
    } = data;
    const strikingCell = newfieldCells.find((cell) => cell.id === strikingCard.cellId);
    dispatch(battleActions.addAnimation({ cellId: strikingCell.id, type: 'makeattack' }));
    const strikePower = canRetaliate ? getWarriorPower(strikingCard) : 0;
    const spellRetaliatePower = retaliateSpell ? retaliateSpell.value : 0;
    const totalStrikePower = strikePower + spellRetaliatePower;
    const recieveHealth = recievingCard.currentHP;
    const retaliateProtect = findSpell(strikingCard, recievingCard, strikingCard.subtype, 'retaliateProtect', newfieldCells);
    const retaliateProtectVal = retaliateProtect
      ? getProtectionVal(totalStrikePower, retaliateProtect, recieveHealth) : 0;
    const calcRetaliatePower = totalStrikePower - retaliateProtectVal > 0
      ? totalStrikePower - retaliateProtectVal : 0;

    if (isKilled(calcRetaliatePower, recieveHealth)) {
      sendCardFromField({
        card: recievingCard,
        castFunc: makeFeatureCast,
        destination: 'grave',
        cardCost: null,
        cellsOnField: newfieldCells,
      });
      moveAttachedSpells(recievingCard.cellId, null, 'kill');
    } else {
      changeCardHP(calcRetaliatePower, recieveHealth, recievingCard);
    }
    const powerSpells = strikingCard.attachments.filter((spell) => spell.name === 'power');
    powerSpells.forEach((spell) => {
      if (spell.charges === 1) {
        deleteChargedSpellCard(spell, newfieldCards, newfieldCells, makeFeatureCast);
      }
    });
  };

  const prepareForAttack = (attackingCard, attackedCard, attackedCell, curFieldCells) => {
    const attackingCell = curFieldCells.find((cell) => cell.id === attackingCard.cellId);
    deleteImmediateSpells();
    handleAnimation(attackingCard, 'delete');
    dispatch(battleActions.deleteActiveCard({ player: attackingCard.player }));
    dispatch(battleActions.turnCardLeft({
      cardId: attackingCard.id,
      qty: 1,
    }));
    dispatch(battleActions.addAnimation({ cellId: attackingCell.id, type: 'makeattack' }));
    const onAttackSpells = findTriggerSpells(attackingCard, attackedCell, 'onattack', 'warrior');
    onAttackSpells.forEach((spell) => {
      if (spell.apply === 'attacked') {
        makeFeatureCast(spell, attackedCell, null, attackedCard.player);
      } else {
        makeFeatureCast(spell, attackingCell, null, attackingCard.player);
      }
    });
  };

  const makeFight = (actionData) => {
    const { card1, card2 } = actionData;
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const newfieldCards = store.getState().battleReducer.fieldCards;
    const attackedCell = newfieldCells.find((cell) => cell.id === card2.cellId);

    if (gameMode === 'tutorial' && card1.player === 'player1') {
      changeTutorStep((prev) => prev + 1);
    }

    prepareForAttack(card1, card2, attackedCell, newfieldCells);

    const evade = findSpell(card1, card2, 'warrior', 'evade', newfieldCells);
    if (evade) {
      makeFeatureCast(evade, attackedCell, card2, card2.player);
      return;
    }

    const attackingInitPower = getWarriorPower(card1);
    const attackingPowerFeature = card1.features.find((feat) => feat.name === 'power' && feat.aim.includes(card2.subtype));
    const attackingAddPower = attackingPowerFeature?.value || 0;
    const attackingPower = attackingInitPower + attackingAddPower;
    const attackedHealth = card2.currentHP;
    const protectSpell = findSpell(card1, card2, card1.subtype, 'protection', newfieldCells);
    const protectionVal = protectSpell
      ? getProtectionVal(attackingPower, protectSpell, attackedHealth) : 0;

    const attachedRetaliate = findSpell(card1, card2, card1.subtype, 'retaliation', newfieldCells);
    const retaliateSpell = findSpell(card1, card2, card1.subtype, 'retaliatestrike', newfieldCells);
    const canRetaliate = card2.subtype !== 'shooter' && card2.type !== 'hero' && card1.subtype !== 'shooter';

    const calculatedPower = attackingPower - protectionVal > 0
      ? attackingPower - protectionVal : 0;

    const powerSpells = card1.attachments.filter((spell) => spell.name === 'power');
    powerSpells.forEach((spell) => {
      if (spell.charges === 1) {
        deleteChargedSpellCard(spell, newfieldCards, newfieldCells, makeFeatureCast);
      }
    });

    if (protectSpell && protectSpell.charges === 1) {
      deleteChargedSpellCard(protectSpell, newfieldCards, newfieldCells, makeFeatureCast);
    }

    dispatch(battleActions.addAnimation({ cellId: attackedCell.id, type: 'attacked' }));
    if (isKilled(calculatedPower, attackedHealth)) {
      sendCardFromField({
        card: card2,
        castFunc: makeFeatureCast,
        destination: 'grave',
        cardCost: null,
        cellsOnField: newfieldCells,
      });
      moveAttachedSpells(card2.cellId, null, 'kill');
      checkIfIsVictory(card2);
    }
    if (!isKilled(calculatedPower, attackedHealth)) {
      changeCardHP(calculatedPower, attackedHealth, card2);
    }
    if (!isKilled(calculatedPower, attackedHealth) && ((canRetaliate || attachedRetaliate))) {
      makeCounterStrike({
        strikingCard: card2,
        recievingCard: card1,
        canRetaliate,
        retaliateSpell: attachedRetaliate,
        newfieldCells,
        newfieldCards,
      });
    }
    if (retaliateSpell) {
      makeCounterStrike({
        strikingCard: card2,
        recievingCard: card1,
        canRetaliate: null,
        retaliateSpell,
        newfieldCells,
        newfieldCards,
      });
    }
  };

  // ADD CARD TO FIELD ///////

  const addCardToField = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, points, curCell, fieldCards, cellsOnField,
    } = actionData;
    const { type, place } = card;
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
    if (curCell.type === 'postponed' && type === 'spell' && place === 'postponed') {
      card.features.forEach((feature) => makeFeatureAttach(feature, curCell, player));
      return;
    }
    dispatch(battleActions.setLastCellWithAction({
      cellActionData: {
        id: cellId, content: 1, source: card.status, type: card.type,
      },
    }));
    if (card.type === 'warrior') {
      const attachSpells = card.features.filter((feat) => feat.attach);
      attachSpells.forEach((spell) => makeFeatureAttach(spell, curCell, card.player));
    }
    if (card.type === 'warrior' && card.status === 'field') {
      moveAttachedSpells(card.cellId, cellId, 'move');
      const movingAttachment = card.attachments.find((feature) => feature.name === 'moving' || feature.name === 'moveNextRow');
      const hasSwift = card.features.find((feat) => feat.name === 'swift')
          || card.attachments.find((feature) => feature.name === 'swift');
      if (!hasSwift && card.player === player && !movingAttachment) {
        dispatch(battleActions.turnCardLeft({
          cardId: card.id,
          qty: 1,
        }));
      }
      [movingAttachment, hasSwift]
        .filter((spell) => spell && spell.charges === 1)
        .forEach((spell) => deleteChargedSpellCard(spell, fieldCards, cellsOnField, makeFeatureCast));
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

  // SEND CARD TO GRAVE BTN

  const sendCardToGraveAction = (card, player, cellsOnField) => {
    handleAnimation(card, 'delete');
    moveAttachedSpells(card, null, 'kill');
    dispatch(battleActions.deleteActiveCard({ player }));
    deleteOtherActiveCard(activeCardPlayer1, activeCardPlayer2, player);
    sendCardFromField({
      card,
      castFunc: makeFeatureCast,
      destination: 'grave',
      cardCost: null,
      cellsOnField,
    });
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
      cardsOnField,
      cellsOnField,
    } = actionData;
    const prevPlayer = newPlayer === 'player1' ? 'player2' : 'player1';
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
      const card = cardsOnField.find((cardEl) => cardEl.cellId === postponedCell.id);
      sendCardFromField({
        card,
        castFunc: makeFeatureCast,
        destination: 'return',
        cardCost: null,
        cellsOnField,
      });
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
    [...turnSpells, ...temporarySpells].forEach((spell) => sendCardFromField({
      card: spell,
      castFunc: makeFeatureCast,
      destination: 'grave',
      cardCost: null,
      cellsOnField,
    }));

    cardsOnField
      .filter((card) => card.player === newPlayer)
      .forEach((card) => {
        const cardsCell = cellsOnField.find((cell) => cell.id === card.cellId);
        const onTurnStartSpells = findTriggerSpells(card, cardsCell, 'onTurnStart', 'warrior');
        onTurnStartSpells.forEach((spell) => makeFeatureCast(spell, cardsCell, null, newPlayer));
      });
    play();
  };

  // MAKE CAST SPELL

  const applySpellCard = async (card, cell, player) => {
    await Promise.all(card.features.map((feature) => new Promise((resolve) => {
      setTimeout(() => {
        if (!feature.condition && !feature.attach && feature.name !== 'cantPostpone') {
          makeFeatureCast(feature, cell, null, player);
        } else if (feature.attach) {
          dispatch(battleActions.setLastCellWithAction({
            cellActionData: {
              id: cell.id, content: 1, source: card.status, type: card.type,
            },
          }));
          makeFeatureAttach(feature, cell, player);
        }
        resolve();
      }, 500);
    })));
  };

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

    await applySpellCard(card, cell, player);

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
      card, player, cost, spellId, cellsOnField,
    } = actionData;
    if (card.status === 'field') {
      moveAttachedSpells(card.cellId, null, 'return');
    }
    handleAnimation(card, 'delete');
    dispatch(battleActions.deleteActiveCard({ player }));
    deleteOtherActiveCard(activeCardPlayer1, activeCardPlayer2, player);
    sendCardFromField({
      card,
      castFunc: makeFeatureCast,
      destination: 'return',
      cardCost: cost,
      cellsOnField,
    });
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
      dispatch(battleActions.turnCardLeft({ cardId: card.id, qty: 1 }));
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

  const makeGameAction = async (actionData, gameType) => {
    const { move } = actionData;
    if (gameType !== 'online') {
      makeMove[move](actionData);
      return;
    }
    setActionPerforming(true);
    if (socket.connected) {
      socket.emit('makeMove', actionData, (res) => {
        const resType = res.error ? 'error' : 'action';
        chooseAction[resType](move, actionData);
        setActionPerforming(false);
      });
    } else {
      chooseAction.error();
      setActionPerforming(false);
    }
  };

  return (
    <AbilitiesContext.Provider value={{
      sendCardFromField,
      makeGameAction,
      makeFeatureCast,
      findTriggerSpells,
      drawCards,
      changeCardsInDeckBuilder,
      sendCardToGraveAction,
      makeMove,
      actionPerforming,
      invoking,
    }}
    >
      {children}
    </AbilitiesContext.Provider>
  );
};

export default AbilitiesContext;
