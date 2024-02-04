/* eslint-disable max-len */
import {
  createContext, useEffect, useState,
} from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import useSound from 'use-sound';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { maxActionPoints } from '../gameData/gameLimits';
import drumAudio from '../assets/DrumBeat.mp3';
import isKilled from '../utils/supportFunc/isKilled.js';
import getAddedWarPower from '../utils/supportFunc/getAddedWarPower.js';
import isSpellMeetCondition from '../utils/supportFunc/isSpellMeetCondition.js';
import useAnimaActions from '../hooks/useAnimaActions.js';
import useBattleActions from '../hooks/useBattleActions.js';
import useResizeWindow from '../hooks/useResizeWindow.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import isAllowedCost from '../utils/supportFunc/isAllowedCost.js';
import findAttachmentType from '../utils/supportFunc/findAttachmentType.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import countSpellDependVal from '../utils/supportFunc/countSpellDependVal.js';
import getProtectionVal from '../utils/supportFunc/getProtectionVal.js';
import findNextRowCells from '../utils/supportFunc/findNextRowCells.js';
import findCellsForSpellApply from '../utils/supportFunc/findCellsForSpellApply.js';
import findCellsToAttachCast from '../utils/supportFunc/findCellToAttachCast.js';
import socket from '../socket.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [play] = useSound(drumAudio, { volume: 0.3 });
  const {
    thisPlayer, playerPoints, gameTurn, activeCells, activeCardPlayer1, activeCardPlayer2,
  } = useSelector((state) => state.battleReducer);
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const {
    addNextLinesCellsAnima,
    addCellsAnimaForAttack,
    addCellsAnimaForWarMove,
    addCellsAnimaForSpellCast,
  } = useAnimaActions();
  const {
    deleteCardfromSource,
    changeCardHP,
    moveAttachedSpells,
    deleteOtherActiveCard,
    addActiveCard,
    sendCardFromField,
    deleteImmediateSpells,
    deleteChargedSpellCard,
    drawCards,
  } = useBattleActions();
  const fontVal = useResizeWindow();
  const { cellsForAttack, cellsForWarMove, cellsForSpellCast } = activeCells;
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const [tutorStep, changeTutorStep] = useState(0);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenChat, setOpenChat] = useState(false);
  const [isOpenInfo, toogleInfoWindow] = useState(false);
  const [invoking, setInvoking] = useState(false);
  const [actionPerforming, setActionPerforming] = useState(false);

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

  const getActiveCard = () => {
    const activeCard1 = store.getState().battleReducer.activeCardPlayer1;
    const activeCard2 = store.getState().battleReducer.activeCardPlayer2;
    return thisPlayer === 'player1' ? activeCard1 : activeCard2;
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
    const attackingPower = getWarriorPower(attackingCard);
    return isSpellMeetCondition({
      attackingCard, defendingCard, spell, type, allFieldCells, attackingPower,
    });
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

  const handleAnimation = (activeCard, option) => {
    if (option === 'delete') {
      dispatch(battleActions.deleteAnimation());
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForWarMove' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForSpellCast' }));
      dispatch(battleActions.setActiveCells({ cellsIds: [], type: 'cellsForAttack' }));
      return;
    }

    if (!isAllowedCost(activeCard, currentPoints) || activeCard.disabled || gameTurn !== thisPlayer) {
      return;
    }

    const {
      type, status, attachments, turn,
    } = activeCard;
    const isCardPostponed = activeCard.cellId === 'postponed1' || activeCard.cellId === 'postponed2';
    const { fieldCells } = store.getState().battleReducer;
    const { fieldCards } = store.getState().battleReducer;

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
        addCellsAnimaForWarMove({
          activeCard, player: thisPlayer, fieldCards, fieldCells,
        });
      }
      if ((findAttachmentType(moverowAttachment, 'bad') && activeCard.player !== thisPlayer)
        || (findAttachmentType(moverowAttachment, 'good') && activeCard.player === thisPlayer)) {
        addNextLinesCellsAnima({
          currentCell, fieldCards, fieldCells,
        });
      }
      if (findAttachmentType(movingAttachment, 'bad') && activeCard.player !== thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: getEnemyPlayer(thisPlayer), fieldCards, fieldCells,
        });
      }
      if (findAttachmentType(movingAttachment, 'good') && activeCard.player === thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: thisPlayer, fieldCards, fieldCells,
        });
      }
      if (status === 'field' && canMove && activeCard.player === thisPlayer) {
        addCellsAnimaForWarMove({
          activeCard, player: thisPlayer, fieldCards, fieldCells,
        });
      }

      if (canAttack && activeCard.player === thisPlayer) {
        addCellsAnimaForAttack(activeCard, fieldCards, fieldCells);
      }
    }

    if (type === 'hero' && turn === 0 && activeCard.player === thisPlayer) {
      addCellsAnimaForSpellCast({
        spellCard: activeCard, player: thisPlayer, fieldCards, fieldCells,
      });
    }

    if (type === 'spell' && (status === 'hand' || isCardPostponed) && activeCard.player === thisPlayer) {
      addCellsAnimaForSpellCast({
        spellCard: activeCard, player: thisPlayer, fieldCards, fieldCells,
      });
    }

    const postponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
    const cantPostpone = activeCard.features.find((feat) => feat.name === 'cantPostpone');
    if (status === 'hand' && postponedCell.content.length === 0 && !postponedCell.disabled && !cantPostpone && activeCard.player === thisPlayer) {
      dispatch(battleActions.addAnimation({ cellId: postponedCell.id, type: 'green' }));
    }
  };

  // CHECK VICTORY

  const showVictoryWindow = (winPlayer) => dispatch(modalsActions.openModal({ type: 'victory', player: winPlayer, roomId: curRoom }));

  const checkIfIsVictory = (killedcard) => {
    if (killedcard.type === 'hero') {
      const winPlayer = killedcard.player === 'player1' ? 'player2' : 'player1';
      showVictoryWindow(winPlayer);
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

  // APPLY SPELL EFFECT

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
    const spellPower = countSpellDependVal(feature, castingPlayer, currentFieldCells, currentFieldCards);
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
    const spellPower = countSpellDependVal(feature, castingPlayer, currentFieldCells, currentFieldCards);
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
      const { topRowCell, bottomRowCell } = findNextRowCells(applyingCell, currentFieldCells, currentFieldCards);
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
        aimCard, feature, castingPlayer, currentFieldCells, currentFieldCards,
      } = data;
      const newHealth = aimCard
        .currentHP + countSpellDependVal(feature, castingPlayer, currentFieldCells, currentFieldCards);
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
      const curPoints = playerPoints.find((item) => item.player === castingPlayer).points;
      const newPoints = curPoints + feature.value;
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
    const cellIds = cells.map((cell) => cell?.id);
    const cardsToApply = currentFieldCards.filter((card) => cellIds.includes(card.cellId)
    && card.type === 'warrior' && featAim.includes(card.subtype));
    cardsToApply.forEach((card) => applySpellEffect({ ...actionData, aimCard: card }));
  };

  // MAKE FEATURE CAST

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
        aimCell, aimCard, currentFieldCells, currentFieldCards, castingPlayer, feature,
      } = data;
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
      const { topRowCell, bottomRowCell } = findNextRowCells(aimCell, currentFieldCells, currentFieldCards);
      const newFieldCards = store.getState().battleReducer.fieldCards;
      const newAimCard = newFieldCards.find((card) => card.id === aimCard.id);
      dispatch(battleActions.addActiveCells({ cellsIds: [topRowCell?.id, bottomRowCell?.id], type: 'cellsForWarMove' }));
      dispatch(battleActions.addAnimation({ cellId: topRowCell?.id, type: 'green' }));
      dispatch(battleActions.addAnimation({ cellId: bottomRowCell?.id, type: 'green' }));
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
        aimCell, castingPlayer, currentFieldCells, currentFieldCards, aimCard, feature,
      });
    }
    if (!feature.immediate) {
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
    }
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
      dispatch(modalsActions.openModal({ type: 'openGraveyard', player: castingPlayer, data: 'grave' }));
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
    if (card.type === 'spell' && curCell.type !== 'postponed') {
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
      tutorStep,
      changeTutorStep,
      isOpenMenu,
      setOpenMenu,
      fontVal,
      isOpenChat,
      setOpenChat,
      isOpenInfo,
      toogleInfoWindow,
      sendCardFromField,
      makeGameAction,
      makeFeatureCast,
      drawCards,
      sendCardToGraveAction,
      actionPerforming,
      makeMove,
      invoking,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
