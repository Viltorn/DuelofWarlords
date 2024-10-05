/* eslint-disable max-len */
import { useState } from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import useAnimaActions from './useAnimaActions.js';
import countSpellDependVal from '../utils/supportFunc/countSpellDependVal.js';
import getProtectionVal from '../utils/supportFunc/getProtectionVal.js';
import isKilled from '../utils/supportFunc/isKilled.js';
import findNextRowCells from '../utils/supportFunc/findNextRowCells.js';
import findCellsForSpellApply from '../utils/supportFunc/findCellsForSpellApply.js';
import isFeatureCostAllowed from '../utils/supportFunc/isFeatureCostAllowed.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import findCellsToAttachCast from '../utils/supportFunc/findCellsToAttachCast.js';
import findCardsToAttachCast from '../utils/supportFunc/findCardsToAttachCast.js';
import findAimCard from '../utils/supportFunc/findAimCard.js';

const useBattleActions = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const [invoking, setInvoking] = useState(false);
  const [tutorStep, changeTutorStep] = useState(0);

  const {
    thisPlayer,
    playerPoints,
    activeCells,
    activeCardPlayer1,
    activeCardPlayer2,
  } = useSelector((state) => state.battleReducer);
  const { cellsForAttack, cellsForWarMove, cellsForSpellCast } = activeCells;
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);

  const {
    handleAnimation,
    checkMeetCondition,
    getWarriorPower,
  } = useAnimaActions();

  const getActiveCard = () => {
    const activeCard1 = store.getState().battleReducer.activeCardPlayer1;
    const activeCard2 = store.getState().battleReducer.activeCardPlayer2;
    return thisPlayer === 'player1' ? activeCard1 : activeCard2;
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

  // CHECK VICTORY

  const showVictoryWindow = (winPlayer) => dispatch(modalsActions.openModal({ type: 'victory', player: winPlayer, roomId: curRoom }));

  const showYourTurnWindow = (winPlayer) => {
    dispatch(modalsActions.openModal({ type: 'playerTurn', player: winPlayer, roomId: curRoom }));
    setTimeout(() => dispatch(modalsActions.closeModal()), 1200);
  };

  const checkIfIsVictory = (killedcard) => {
    if (killedcard.type === 'hero') {
      const winPlayer = killedcard.player === 'player1' ? 'player2' : 'player1';
      showVictoryWindow(winPlayer);
    }
  };

  // FIND SPELL

  const findSpell = ({
    attackingCard, defendingCard, type, spell, allFieldCells, allFieldCards, spellOwnerPoints,
  }) => {
    const protectingCell = allFieldCells.find((cell) => cell.id === defendingCard.cellId);
    const cardAttachSpell = defendingCard.attachments.find((feat) => feat.name === spell
      && feat.aim.includes(type));
    const cardFeatureSpell = defendingCard.features.find((feat) => feat.name === spell
    && feat.aim.includes(type));
    const cellAttachSpell = protectingCell.attachments.find((feat) => feat.name === spell
      && feat.aim.includes(type));
    const canUseCellAttach = cellAttachSpell
      && checkMeetCondition({
        attackingCard, defendingCard, spell: cellAttachSpell, type, allFieldCells, allFieldCards, spellOwnerPoints,
      });
    const canUseCardAttach = cardAttachSpell
      && checkMeetCondition({
        attackingCard, defendingCard, spell: cardAttachSpell, type, allFieldCells, allFieldCards, spellOwnerPoints,
      });
    const canUseCardFeature = cardFeatureSpell
      && checkMeetCondition({
        attackingCard, defendingCard, spell: cardFeatureSpell, type, allFieldCells, allFieldCards, spellOwnerPoints,
      });
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

  const deleteCardFromSource = (card) => {
    // Extract properties from the card object
    const {
      player, status, cellId, id, type,
    } = card;

    // Delete the card from the appropriate source based on its status
    if (status === 'hand') {
      dispatch(battleActions.deleteHandCard({ cardId: id, player }));
    } else {
      dispatch(battleActions.deleteFieldCard({ cardId: id }));
    }

    // Perform additional actions based on conditions
    if (cellId === 'postponed1' || cellId === 'postponed2') {
      // Turn the postponed card to cover status
      dispatch(battleActions.turnPostponed({ player, status: 'cover' }));
    }

    // If the card type is 'warrior', delete any attachment associated with it
    if (type === 'warrior') {
      dispatch(battleActions.deleteAttachment({ spellId: id }));
    }
  };

  const changeCardHP = (power, health, card) => {
    dispatch(battleActions.changeHP({
      health: health - power,
      cardId: card.id,
    }));
  };

  const moveAttachedSpells = (cellId, endCellId, type) => {
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const spellsInCell = currentFieldCards.filter((card) => card.cellId === cellId && card.type === 'spell');
    spellsInCell.forEach((card) => {
      deleteCardFromSource(card);
      if (type === 'kill' && !card.returnable) {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.addToGraveyard({ card }));
      } else if (type === 'kill' && card.returnable) {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.returnCard({ card, cost: card.cost }));
      } else if (type === 'move') {
        dispatch(battleActions.addFieldContent({ card, id: endCellId }));
      } else if (type === 'return') {
        dispatch(battleActions.deleteAttachment({ spellId: card.id }));
        dispatch(battleActions.returnCard({ card, cost: card.cost }));
      }
    });
  };

  const castLastSpells = (card, castFunc, cellsOnField, destination) => {
    const { type, status } = card;
    const cardCell = cellsOnField.find((cell) => cell.id === card.cellId);
    const lastSpells = type === 'warrior' ? findTriggerSpells(card, cardCell, 'lastcall', 'warrior') : findTriggerSpells(card, cardCell, 'lastcall', 'spell');
    if (lastSpells && destination === 'grave' && status === 'field') {
      lastSpells.forEach((spell) => castFunc(spell, cardCell, card, card.player));
    }
  };

  const sendCardFromField = (data) => {
    const {
      card, castFunc, destination, cardCost, cellsOnField,
    } = data;
    castLastSpells(card, castFunc, cellsOnField, destination);
    if (card.type === 'spell') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
    deleteCardFromSource(card);
    if (destination === 'grave' && !card.returnable) {
      dispatch(battleActions.addToGraveyard({ card }));
    } else {
      const cost = cardCost ?? card.cost;
      dispatch(battleActions.returnCard({ card, cost }));
    }
  };

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

  // APPLY SPELL EFFECT

  const makeSpellCardAttack = (data) => {
    const {
      feature,
      aimCard,
      currentFieldCells,
      currentFieldCards,
      castFunc,
      aimCardOwnerPoints,
    } = data;
    const receivedHealth = aimCard.currentHP;
    const spellPower = countSpellDependVal({
      spell: feature, aimCardPower: getWarriorPower(aimCard), currentFieldCards,
    });
    const protectSpell = findSpell({
      attackingCard: null,
      defendingCard: aimCard,
      type: 'spell',
      spell: 'protection',
      allFieldCells: currentFieldCells,
      allFieldCards: currentFieldCards,
      spellOwnerPoints: aimCardOwnerPoints,
    });
    const protectionVal = protectSpell
      ? getProtectionVal(spellPower, protectSpell, receivedHealth) : 0;
    const calculatedPower = spellPower - protectionVal > 0 ? spellPower - protectionVal : 0;
    const applyingCell = currentFieldCells.find((cell) => cell.id === aimCard.cellId);

    dispatch(battleActions.addAnimation({ cellId: applyingCell.id, type: 'attacked' }));
    if (isKilled(calculatedPower, receivedHealth)) {
      const cardCell = currentFieldCells.find((cell) => cell.id === aimCard.cellId);
      const lastSpells = findTriggerSpells(aimCard, cardCell, 'lastcall', 'warrior');
      deleteCardFromSource(aimCard);
      dispatch(battleActions.addToGraveyard({ card: aimCard }));
      moveAttachedSpells(aimCard.cellId, null, 'kill');
      lastSpells.forEach((feat) => castFunc(feat, cardCell, null, aimCard.player));
      checkIfIsVictory(aimCard);
    }
    if (!isKilled(calculatedPower, receivedHealth)) changeCardHP(calculatedPower, receivedHealth, aimCard);
    if (protectSpell && protectSpell?.charges === 1) deleteChargedSpellCard(protectSpell, currentFieldCards, currentFieldCells, castFunc);
    if (protectSpell && protectSpell.cost) dispatch(battleActions.setPlayerPoints({ points: aimCardOwnerPoints - protectSpell.cost, player: protectSpell.player }));
  };

  const makeCardHeal = (data, type) => {
    const {
      feature, castingPlayer, currentFieldCards, aimCard,
    } = data;
    let appliedCard;
    if (type === 'ownerHeroHeal') {
      const enemyPlayer = feature.player;
      appliedCard = currentFieldCards.find((card) => card.type === 'hero' && card.player === enemyPlayer);
    }
    if (type === 'heroHeal') {
      appliedCard = currentFieldCards.find((card) => card.type === 'hero' && card.player === castingPlayer);
    }
    if (type === 'heal') {
      appliedCard = aimCard;
    }
    const spellPower = countSpellDependVal({
      spell: feature, aimCardPower: getWarriorPower(aimCard), currentFieldCards,
    });
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
      deleteCardFromSource(aimCard);
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
        deleteCardFromSource(aimCard);
        dispatch(battleActions.returnCard({ card: aimCard, cost: aimCard.cost }));
        dispatch(battleActions.deleteActiveCard({ player: aimCard.player }));
      }
    },
    cleanSpell: (data) => {
      const { aimCard, feature } = data;
      if (feature.aim.includes(aimCard.type)) {
        handleAnimation(aimCard, 'delete');
        deleteCardFromSource(aimCard);
        dispatch(battleActions.addToGraveyard({ card: aimCard }));
      }
    },
    heal: (data) => {
      makeCardHeal(data, 'heal');
    },
    ownerHeroHeal: (data) => {
      makeCardHeal(data, 'ownerHeroHeal');
    },
    heroHeal: (data) => {
      makeCardHeal(data, 'heroHeal');
    },
    health: (data) => {
      const {
        aimCard, feature, currentFieldCards,
      } = data;
      const newHealth = aimCard
        .currentHP + countSpellDependVal({
        spell: feature, aimCardPower: getWarriorPower(aimCard), currentFieldCards,
      });
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
      const playerToApply = feature.type === 'good' ? castingPlayer : getEnemyPlayer(castingPlayer);
      const curPoints = playerPoints.find((item) => item.player === playerToApply).points;
      const newPoints = curPoints + feature.value;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player: playerToApply }));
    },
    stealPoints: (data) => {
      const { feature, castingPlayer } = data;
      const enemyPlayer = getEnemyPlayer(castingPlayer);
      const ownerPoints = playerPoints.find((item) => item.player === castingPlayer).points;
      const enemyPoints = playerPoints.find((item) => item.player === enemyPlayer).points;
      const newPlayerPoints = ownerPoints + feature.value.owner;
      const newEnemyPoints = enemyPoints - feature.value.enemy;
      dispatch(battleActions.setPlayerPoints({ points: newPlayerPoints, player: castingPlayer }));
      dispatch(battleActions.setPlayerPoints({ points: newEnemyPoints, player: enemyPlayer }));
    },
    readiness: (data) => {
      const { aimCard } = data;
      const { turn } = aimCard;
      const newTurn = turn === 2 ? 2 : 1;
      dispatch(battleActions.turnCardRight({
        cardId: aimCard.id,
        qty: newTurn,
      }));
    },
  };

  const applySpellEffect = (data) => {
    if (gameMode === 'tutorial') {
      changeTutorStep((prev) => prev + 1);
    }
    const { feature, aimCard } = data;
    const aimCardOwnerPoints = store.getState().battleReducer.playerPoints.find((item) => item.player === aimCard?.player)?.points ?? 0;

    if ((aimCard && feature.aimStatus === aimCard.status) || !feature.aimStatus) {
      performSpellEffect[feature.name]({ ...data, aimCardOwnerPoints });
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
    const featOwnerPoints = store.getState().battleReducer.playerPoints.find((item) => item.player === player).points;
    if (!isFeatureCostAllowed(feature, featOwnerPoints)) return;

    const currentFieldCells = store.getState().battleReducer.fieldCells;
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const cardsInCell = currentFieldCards.filter((card) => card.cellId === aimCell?.id);
    const aimCard = applyingCard ?? findAimCard(feature, cardsInCell);

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
    if (feature.cost) {
      const currenttOwnerPoints = store.getState().battleReducer.playerPoints.find((item) => item.player === player).points;
      dispatch(battleActions.setPlayerPoints({ points: currenttOwnerPoints - feature.cost, player }));
    }
    if (feature.charges === 1) deleteChargedSpellCard(feature, currentFieldCards, currentFieldCells, makeFeatureCast);
  };

  const addActiveCard = (card, player) => {
    dispatch(battleActions.addActiveCard({ card, player }));
  };

  const deleteOtherActiveCard = (card1, card2, thisplayer) => {
    const card1Id = card1 ? card1.id : null;
    const card2Id = card2 ? card2.id : null;
    if (card1Id === card2Id) {
      const anotherPlayer = thisplayer === 'player1' ? 'player2' : 'player1';
      dispatch(battleActions.deleteActiveCard({ player: anotherPlayer }));
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

  const attachSpellEffectOnCards = (cards, feature) => {
    cards.forEach((card) => dispatch(battleActions.addWarriorAttachment({ cellId: card.cellId, feature })));
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

  // MAKE FEATURE ATTACH
  const makeFeatureAttach = (feature, aimCell, castingPlayer) => {
    const currentFieldCells = store.getState().battleReducer.fieldCells;
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const enemyPlayer = getEnemyPlayer(castingPlayer);
    const { attach } = feature;
    const cellsToAttach = findCellsToAttachCast({
      currentFieldCells, currentFieldCards, feature, castingPlayer, enemyPlayer, aimCell,
    });
    const cardsToAttach = findCardsToAttachCast({
      currentFieldCells, currentFieldCards, feature, castingPlayer, enemyPlayer, aimCell,
    });
    if (cardsToAttach) {
      attachSpellEffectOnCards(cardsToAttach, feature);
    }
    if (cellsToAttach) {
      attachSpellEffectOnCells(cellsToAttach, feature);
    }
    if (cellsToAttach && attach.includes('grave')) {
      const playerToApply = feature.type === 'good' ? castingPlayer : getEnemyPlayer(castingPlayer);
      dispatch(modalsActions.openModal({ type: 'openGraveyard', player: playerToApply, data: 'grave' }));
      const currenttOwnerPoints = store.getState().battleReducer.playerPoints.find((item) => item.player === castingPlayer).points;
      dispatch(battleActions.setPlayerPoints({ points: currenttOwnerPoints - feature.cost ?? 0, player: castingPlayer }));
    }
    if (!cellsToAttach && (attach.includes('warrior') || attach.includes('hero'))) {
      attachSpellEffectOnWar({
        aimCell, feature, castingPlayer, currentFieldCards, currentFieldCells,
      });
    }
  };

  // DELETE IMMIDIATE SPELLS

  const deleteImmediateSpells = () => {
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    currentFieldCards
      .filter((card) => card.type === 'warrior')
      .forEach((card) => {
        const immediate = card.attachments.find((spell) => spell.immediate);
        if (immediate) {
          dispatch(battleActions.deleteAttachment({ spellId: immediate.id }));
        }
      });
  };
  // MAKE FIGHT

  const makeCounterStrike = (data) => {
    const {
      strikingCard,
      recievingCard,
      canRetaliate,
      retaliateSpell,
      retaliateStrike,
      newfieldCells,
      newfieldCards,
      recieveCardOwnerPoints,
    } = data;
    const strikingCell = newfieldCells.find((cell) => cell.id === strikingCard.cellId);
    dispatch(battleActions.addAnimation({ cellId: strikingCell.id, type: 'makeattack' }));
    const strikePower = canRetaliate ? getWarriorPower(strikingCard) : 0;
    const spellRetaliatePower = retaliateSpell ? countSpellDependVal({
      spell: retaliateSpell, aimCardPower: getWarriorPower(recievingCard), currentFieldCards: newfieldCards,
    }) : 0;

    const retaliateStrikePower = retaliateStrike ? countSpellDependVal({
      spell: retaliateStrike, aimCardPower: getWarriorPower(recievingCard), currentFieldCards: newfieldCards,
    }) : 0;
    const totalStrikePower = strikePower + spellRetaliatePower + retaliateStrikePower;
    const recieveHealth = recievingCard.currentHP;
    const retaliateProtect = findSpell({
      attackingCard: strikingCard,
      defendingCard: recievingCard,
      type: strikingCard.subtype,
      spell: 'retaliateProtect',
      allFieldCells: newfieldCells,
      allFieldCards: newfieldCards,
      spellOwnerPoints: recieveCardOwnerPoints,
    });
    const retaliateProtectVal = retaliateProtect
      ? getProtectionVal(totalStrikePower, retaliateProtect, recieveHealth) : 0;
    const calcRetaliatePower = totalStrikePower - retaliateProtectVal > 0
      ? totalStrikePower - retaliateProtectVal : 0;

    console.log(calcRetaliatePower);
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
      if (spell.charges === 1) deleteChargedSpellCard(spell, newfieldCards, newfieldCells, makeFeatureCast);
    });
    if (retaliateProtect && retaliateProtect.cost) dispatch(battleActions.setPlayerPoints({ points: recieveCardOwnerPoints - retaliateProtect.cost, player: retaliateProtect.player }));
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

  const drawCards = (actionData) => {
    deleteImmediateSpells();
    const { player, number } = actionData;
    dispatch(battleActions.setCardDrawStatus({ player, status: true }));
    for (let i = 1; i <= number; i += 1) {
      dispatch(battleActions.drawCard({ player }));
    }
  };

  // APPLY SPELL CARD

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

  return {
    deleteCardFromSource,
    changeCardHP,
    moveAttachedSpells,
    deleteOtherActiveCard,
    addActiveCard,
    sendCardFromField,
    deleteImmediateSpells,
    deleteChargedSpellCard,
    drawCards,
    sendCardToGraveAction,
    checkMeetCondition,
    canBeAttacked,
    canBeCast,
    canBeMoved,
    getActiveCard,
    findSpell,
    checkIfIsVictory,
    makeSpellCardAttack,
    tutorStep,
    changeTutorStep,
    prepareForAttack,
    makeCounterStrike,
    makeFeatureAttach,
    makeFeatureCast,
    applySpellCard,
    showYourTurnWindow,
    invoking,
  };
};

export default useBattleActions;
