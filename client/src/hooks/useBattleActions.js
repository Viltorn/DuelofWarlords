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
import findEmptyNextRowCells from '../utils/supportFunc/findEmptyNextRowCells.js';
import findCellsForSpellApply from '../utils/supportFunc/findCellsForSpellApply.js';
import isFeatureCostAllowed from '../utils/supportFunc/isFeatureCostAllowed.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import findCellsToAttachCast from '../utils/supportFunc/findCellsToAttachCast.js';
import findCardsToAttachCast from '../utils/supportFunc/findCardsToAttachCast.js';
import findAimCard from '../utils/supportFunc/findAimCard.js';
import getRandomFromArray from '../utils/getRandomFromArray.js';
import calcAllSpellslValue from '../utils/supportFunc/calcAllSpellslValue.js';
import { addPlayerToCard } from '../utils/makeDeckForPlayer.js';
import useSoundEffects from './useSoundEffects.js';

const useBattleActions = () => {
  const dispatch = useDispatch();
  const store = useStore();
  const [invoking, setInvoking] = useState(false);
  const [tutorStep, changeTutorStep] = useState(0);

  const {
    thisPlayer,
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
    addAnimatedCells,
    addAdjasentCellsForMove,
    addNextLinesCellsForMove,
    warHasSpecialFeature,
  } = useAnimaActions();

  const { play } = useSoundEffects();

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

  const showVictoryWindow = (winPlayer) => {
    dispatch(modalsActions.openModal({ type: 'victory', player: winPlayer, roomId: curRoom }));
  };

  const showYourTurnWindow = (winPlayer) => {
    dispatch(modalsActions.openModal({ type: 'playerTurn', player: winPlayer, roomId: curRoom }));
    setTimeout(() => dispatch(modalsActions.closeModal()), 1200);
  };

  const isHeroKilled = (killedcard) => killedcard.type === 'hero';

  // FIND SPELL

  const findSpells = ({
    attackingCard, defendingCard, type, spell, allFieldCells, allFieldCards, spellOwnerPoints,
  }) => {
    const protectingCell = allFieldCells.find((cell) => cell.id === defendingCard.cellId);
    const cardAttachSpells = defendingCard.attachments.filter((feat) => feat.name === spell
      && feat.aim.includes(type) && checkMeetCondition({
      attackingCard, defendingCard, spell: feat, type, allFieldCells, allFieldCards, spellOwnerPoints,
    }));
    const cardFeatureSpells = defendingCard.features.filter((feat) => feat.name === spell
    && feat.aim.includes(type) && !feat.attach && checkMeetCondition({
      attackingCard, defendingCard, spell: feat, type, allFieldCells, allFieldCards, spellOwnerPoints,
    }));
    const cellAttachSpells = protectingCell.attachments.filter((feat) => feat.name === spell
      && feat.aim.includes(type) && checkMeetCondition({
      attackingCard, defendingCard, spell: feat, type, allFieldCells, allFieldCards, spellOwnerPoints,
    }));

    const allFoundSpells = [...cardAttachSpells, ...cardFeatureSpells, ...cellAttachSpells];
    const totalCost = allFoundSpells.reduce((cost, foundSpell) => {
      cost += foundSpell.cost ?? 0;
      return cost;
    }, 0);

    if (totalCost > spellOwnerPoints) return [];
    return allFoundSpells;
  };

  const deleteCardFromSource = (card) => {
    // Extract properties from the card object
    const {
      player, status, id, type,
    } = card;

    // Delete the card from the appropriate source based on its status
    if (status === 'hand') dispatch(battleActions.deleteHandCard({ cardId: id, player }));
    if (status === 'field' || status === 'graveyard') dispatch(battleActions.deleteFieldCard({ cardId: id }));
    if (status === 'deck') dispatch(battleActions.deleteDeckCard({ cardId: id, player }));

    // Perform additional actions based on conditions

    // If the card type is 'warrior', delete any attachment associated with it
    if (type === 'warrior') dispatch(battleActions.deleteAttachment({ spellId: id }));
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

  const castLastSpells = (card, castFunc, cellsOnField, destination, gameTurn) => {
    const { type, status } = card;
    const cardCell = cellsOnField.find((cell) => cell.id === card.cellId);
    const lastSpells = type === 'warrior' ? findTriggerSpells(card, cardCell, 'lastcall', 'warrior', gameTurn) : findTriggerSpells(card, cardCell, 'lastcall', 'spell', gameTurn);
    if (lastSpells.length > 0 && destination === 'grave' && status === 'field') {
      console.log(lastSpells);
      lastSpells.forEach((spell) => castFunc({
        feature: spell, aimCell: cardCell, applyingCard: card, player: card.player, player2Type: '', performAIAction: null,
      }));
    }
  };

  const sendCardFromField = (data) => {
    const {
      card, castFunc, destination, cardCost, cellsOnField, gameTurn, player,
    } = data;
    if (card.type === 'spell') {
      dispatch(battleActions.deleteAttachment({ spellId: card.id }));
    }
    deleteCardFromSource(card);
    if (destination === 'grave' && !card.returnable) {
      dispatch(battleActions.addToGraveyard({ card }));
      castLastSpells(card, castFunc, cellsOnField, destination, gameTurn);
    } else {
      const cost = cardCost ?? card.cost;
      const playerHand = player ?? card.player;
      const newCard = addPlayerToCard(card, playerHand);
      dispatch(battleActions.returnCard({ card: newCard, cost, playerHand }));
    }
  };

  const changeChargedSpellCard = (spell, allFieldCards, allFieldCells, castFunc, gameTurn) => {
    if (!spell || !spell.charges) {
      return;
    }
    const spellCardOnField = allFieldCards.find((card) => card.id === spell.id);
    const newCharges = spellCardOnField ? spellCardOnField.curCharges - 1 : 0;
    if (spellCardOnField && newCharges === 0) {
      sendCardFromField({
        card: spellCardOnField,
        castFunc,
        destination: 'grave',
        cardCost: null,
        cellsOnField: allFieldCells,
        gameTurn,
      });
    }
    if (spellCardOnField && newCharges !== 0) {
      dispatch(battleActions.changeSpellCharges({ newCharges, cardId: spellCardOnField.id }));
    }
    if (spell.charges === 1) {
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
      playerPoints,
      gameTurn,
      lastPlayedCard,
    } = data;
    const aimCardOwnerPoints = playerPoints.find((item) => item.player === aimCard?.player)?.points ?? 0;
    const receivedHealth = aimCard.currentHP;
    const spellPower = countSpellDependVal({
      spell: feature, aimCardPower: getWarriorPower(aimCard), currentFieldCards, lastPlayedCard, appliedCard: aimCard,
    });
    const protectSpells = findSpells({
      attackingCard: null,
      defendingCard: aimCard,
      type: 'spell',
      spell: 'protection',
      allFieldCells: currentFieldCells,
      allFieldCards: currentFieldCards,
      spellOwnerPoints: aimCardOwnerPoints,
    });
    const protectionVal = protectSpells.length > 0
      ? getProtectionVal(protectSpells, spellPower, receivedHealth) : 0;
    const calculatedPower = spellPower - protectionVal > 0 ? spellPower - protectionVal : 0;
    const applyingCell = currentFieldCells.find((cell) => cell.id === aimCard.cellId);

    dispatch(battleActions.addAnimation({ cellId: applyingCell.id, type: feature.school }));
    if (isKilled(calculatedPower, receivedHealth)) {
      moveAttachedSpells(aimCard.cellId, null, 'kill');
      const destination = warHasSpecialFeature({
        warCard: aimCard, fieldCards: currentFieldCards, fieldCells: currentFieldCells, featureName: 'returnable',
      }) ? 'return' : 'grave';
      sendCardFromField({
        card: aimCard,
        castFunc,
        destination,
        cardCost: null,
        cellsOnField: currentFieldCells,
        gameTurn,
      });
    }
    if (isKilled(calculatedPower, receivedHealth) && isHeroKilled(aimCard)) {
      showVictoryWindow(getEnemyPlayer(aimCard.player));
      changeCardHP(calculatedPower, receivedHealth, aimCard);
    }
    if (!isKilled(calculatedPower, receivedHealth)) changeCardHP(calculatedPower, receivedHealth, aimCard);
    if (protectSpells.length > 0) {
      protectSpells.forEach((protectSpell) => changeChargedSpellCard(protectSpell, currentFieldCards, currentFieldCells, castFunc, gameTurn));
      const totalCost = protectSpells.reduce((cost, spell) => {
        cost += spell.cost ?? 0;
        return cost;
      }, 0);
      dispatch(battleActions.setPlayerPoints({ points: aimCardOwnerPoints - totalCost, player: aimCard.player }));
    }
  };

  const makeCardHeal = (data, type) => {
    const {
      feature, castingPlayer, currentFieldCards, aimCard, lastPlayedCard,
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
      spell: feature, aimCardPower: getWarriorPower(aimCard), currentFieldCards, lastPlayedCard,
    });
    const healthLessThanDefault = appliedCard.currentHP < appliedCard.health;
    if (healthLessThanDefault) {
      const newHealth = (appliedCard.currentHP + spellPower) >= appliedCard.health
        ? appliedCard.health : appliedCard.currentHP + spellPower;
      play({ id: 'heal' });
      dispatch(battleActions.addAnimation({ cellId: appliedCard.cellId, type: 'healed' }));
      dispatch(battleActions.changeHP({
        health: newHealth,
        cardId: appliedCard.id,
      }));
    }
  };

  const performSpellEffect = {
    attack: (data) => {
      makeSpellCardAttack(data);
    },
    power: (data) => {
      const { currentFieldCards, feature, aimCard } = data;
      const newAtkPower = aimCard
        .currentP + countSpellDependVal({
        spell: feature, aimCardPower: getWarriorPower(aimCard, 'atkPower'), currentFieldCards,
      });
      const newDefPower = aimCard
        .currentDP + countSpellDependVal({
        spell: feature, aimCardPower: getWarriorPower(aimCard, 'defPower'), currentFieldCards,
      });
      dispatch(battleActions.changePower({ power: newAtkPower >= 0 ? newAtkPower : 0, cardId: aimCard.id, type: 'currentP' }));
      dispatch(battleActions.changePower({ power: newDefPower >= 0 ? newDefPower : 0, cardId: aimCard.id, type: 'currentDP' }));
      dispatch(battleActions.addAnimation({ cellId: aimCard.cellId, type: feature.school }));
      const attachType = feature.type === 'good' ? 'buff' : 'deBuff';
      dispatch(battleActions.addAnimation({ cellId: aimCard.cellId, type: attachType }));
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
        if (isKilled(attackingPower, receivedHealth)) showVictoryWindow(getEnemyPlayer(heroCard.player));
      }
    },
    evade: (data) => {
      const {
        currentFieldCells, currentFieldCards, aimCard, applyingCell,
      } = data;
      const emptyNextRowCells = findEmptyNextRowCells(applyingCell, currentFieldCells, currentFieldCards);
      const choosenCell = emptyNextRowCells[0];
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
    moveRandomNextRowCell: (data) => {
      const {
        currentFieldCells, currentFieldCards, aimCard, applyingCell,
      } = data;
      const emptyNextRowCells = findEmptyNextRowCells(applyingCell, currentFieldCells, currentFieldCards);
      const choosenCell = emptyNextRowCells[0];
      if (!choosenCell) return;
      console.log(aimCard);
      deleteCardFromSource(aimCard);
      dispatch(battleActions.addFieldContent({ card: aimCard, id: choosenCell.id }));
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
      const {
        feature, castingPlayer, aimCard, player2Type, currentFieldCells, currentFieldCards, playerPoints, performAIAction,
      } = data;
      const spellCard = { ...feature.value, player: castingPlayer, cellId: aimCard.cellId };
      dispatch(battleActions.addActiveCard({ card: spellCard, player: castingPlayer }));
      if (player2Type === 'computer' && castingPlayer === 'player2') {
        addAnimatedCells(spellCard, currentFieldCells, currentFieldCards, 'player2');
        performAIAction({
          card: spellCard, playerPoints, fieldCards: currentFieldCards, fieldCells: currentFieldCells, room: '',
        });
      } else {
        setInvoking(true);
        handleAnimation(spellCard, 'add');
      }
    },
    drawCard: (data) => {
      dispatch(battleActions.drawCard({ player: data.castingPlayer }));
    },
    increasePoints: (data) => {
      const { feature, castingPlayer, playerPoints } = data;
      const playerToApply = feature.type === 'good' ? castingPlayer : getEnemyPlayer(castingPlayer);
      const curPoints = playerPoints.find((item) => item.player === playerToApply).points;
      const newPoints = curPoints + feature.value;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player: playerToApply }));
    },
    stealPoints: (data) => {
      const {
        feature, castingPlayer, playerPoints, lastPlayedCard, currentFieldCards,
      } = data;
      const enemyPlayer = getEnemyPlayer(castingPlayer);
      const enemyPoints = playerPoints.find((p) => p.player === enemyPlayer).points;
      const spellValue = countSpellDependVal({
        spell: feature, aimCardPower: null, currentFieldCards, lastPlayedCard, playerPoints,
      });
      dispatch(battleActions.setPlayerPoints({ points: enemyPoints - spellValue, player: enemyPlayer }));
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
    getCardCopy: (data) => {
      const { aimCard, castingPlayer } = data;
      console.log('getcardcopy');
      dispatch(battleActions.drawSpecificCard({ player: castingPlayer, cardName: aimCard.description }));
    },
  };

  const applySpellEffect = (data) => {
    if (gameMode === 'tutorial') {
      changeTutorStep((prev) => prev + 1);
    }
    const { feature, aimCard } = data;
    const { playerPoints } = store.getState().battleReducer;

    if ((aimCard && feature.aimStatus === aimCard.status) || !feature.aimStatus) {
      performSpellEffect[feature.name]({ ...data, playerPoints });
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

  const makeFeatureCast = ({
    feature, aimCell, applyingCard, player, player2Type, performAIAction,
  }) => {
    const { playerPoints } = store.getState().battleReducer;
    const featOwnerPoints = playerPoints.find((item) => item.player === player).points;
    if (!isFeatureCostAllowed(feature, featOwnerPoints)) return;

    const { lastPlayedCard } = store.getState().battleReducer;
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
        performAIAction,
        player2Type,
        playerPoints,
        lastPlayedCard,
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
        performAIAction,
        player2Type,
        playerPoints,
        lastPlayedCard,
      });
    }
    if (feature.cost) {
      const currentPlayerPoints = store.getState().battleReducer.playerPoints;
      const currentOwnerPoints = currentPlayerPoints.find((item) => item.player === player).points;
      dispatch(battleActions.setPlayerPoints({ points: currentOwnerPoints - feature.cost, player }));
    }
    if (feature.name !== 'heal') play({ id: `${feature.school}` });
    if (feature.charges) changeChargedSpellCard(feature, currentFieldCards, currentFieldCells, makeFeatureCast);
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
        aimCard, castingPlayer, feature, player2Type, performAIAction, currentFieldCells, playerPoints,
      } = data;
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
      const newFieldCards = store.getState().battleReducer.fieldCards;
      const newAimCard = newFieldCards.find((card) => card.id === aimCard.id);
      dispatch(battleActions.addActiveCard({ card: newAimCard, player: castingPlayer }));
      if (player2Type === 'computer' && castingPlayer === 'player2') {
        addAnimatedCells(newAimCard, currentFieldCells, newFieldCards, 'player2');
        performAIAction({
          card: newAimCard, playerPoints, fieldCards: newFieldCards, fieldCells: currentFieldCells, room: '',
        });
      } else {
        handleAnimation(newAimCard, 'add');
      }
    },
    moveNextRow: (data) => {
      const {
        aimCard, currentFieldCells, currentFieldCards, castingPlayer, feature, player2Type, performAIAction, playerPoints,
      } = data;

      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
      const newFieldCards = store.getState().battleReducer.fieldCards;
      const newAimCard = newFieldCards.find((card) => card.id === aimCard.id);
      dispatch(battleActions.addActiveCard({ card: newAimCard, player: castingPlayer }));
      addNextLinesCellsForMove({ activeCard: aimCard, fieldCards: currentFieldCards, fieldCells: currentFieldCells });
      if (player2Type === 'computer' && castingPlayer === 'player2') {
        performAIAction({
          card: newAimCard, playerPoints, fieldCards: newFieldCards, fieldCells: currentFieldCells, room: '',
        });
      }
    },
    moveAdjasent: (data) => {
      const {
        aimCard, currentFieldCells, currentFieldCards, castingPlayer, feature, player2Type, performAIAction, playerPoints,
      } = data;
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
      const newFieldCards = store.getState().battleReducer.fieldCards;
      const newAimCard = newFieldCards.find((card) => card.id === aimCard.id);
      dispatch(battleActions.addActiveCard({ card: newAimCard, player: castingPlayer }));
      addAdjasentCellsForMove({ activeCard: aimCard, fieldCards: currentFieldCards, fieldCells: currentFieldCells });
      if (player2Type === 'computer' && castingPlayer === 'player2') {
        performAIAction({
          card: newAimCard, playerPoints, fieldCards: newFieldCards, fieldCells: currentFieldCells, room: '',
        });
      }
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
      aimCell, feature, castingPlayer, currentFieldCards, currentFieldCells, player2Type, performAIAction, playerPoints,
    } = data;
    const aimCard = currentFieldCards.find((card) => card.cellId === aimCell.id
      && (card.type === 'warrior' || card.type === 'hero'));
    const { name } = feature;
    if (feature.immediate && aimCard && aimCard.status === feature.aimStatus) {
      attachSpellEffect[name]({
        aimCell, castingPlayer, currentFieldCells, currentFieldCards, aimCard, feature, player2Type, performAIAction, playerPoints,
      });
    }
    if (!feature.immediate) {
      dispatch(battleActions.addWarriorAttachment({ cellId: aimCard.cellId, feature }));
    }
  };

  // MAKE FEATURE ATTACH
  const makeFeatureAttach = (feature, aimCell, castingPlayer, player2Type, performAIAction) => {
    const currentFieldCells = store.getState().battleReducer.fieldCells;
    const currentFieldCards = store.getState().battleReducer.fieldCards;
    const { playerPoints } = store.getState().battleReducer;
    const enemyPlayer = getEnemyPlayer(castingPlayer);
    const { attach } = feature;
    const cellsToAttach = findCellsToAttachCast({
      currentFieldCells, currentFieldCards, feature, castingPlayer, enemyPlayer, aimCell,
    });
    const cardsToAttach = findCardsToAttachCast({
      currentFieldCells, currentFieldCards, feature, castingPlayer, aimCell,
    });
    if (cardsToAttach) {
      attachSpellEffectOnCards(cardsToAttach, feature);
    }
    if (cellsToAttach) {
      attachSpellEffectOnCells(cellsToAttach, feature);
    }
    if (cellsToAttach && attach.includes('grave')) {
      const playerToApply = aimCell.player;
      dispatch(modalsActions.openModal({ type: 'openCheckCard', player: playerToApply, id: 'grave' }));
      if (player2Type === 'computer' && castingPlayer === 'player2') {
        const cardsCanBeRessurected = currentFieldCards
          .filter((c) => c.status === 'graveyard' && c.player === playerToApply && feature.aim.includes(c.subtype));
        const cardToRes = getRandomFromArray(cardsCanBeRessurected);
        console.log(cardToRes);
        performAIAction({
          card: cardToRes, playerPoints, fieldCards: currentFieldCards, fieldCells: currentFieldCells, room: '', ressurectSpell: feature,
        });
        dispatch(modalsActions.closeModal());
      }
    }
    if (!cellsToAttach && (attach.includes('warrior') || attach.includes('hero'))) {
      attachSpellEffectOnWar({
        aimCell, feature, castingPlayer, currentFieldCards, currentFieldCells, player2Type, performAIAction, playerPoints,
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
          console.log(immediate);
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
      retaliateSpells,
      retaliateStrikes,
      retributionSpells,
      newfieldCells,
      newfieldCards,
      recieveCardOwnerPoints,
      gameturn,
    } = data;
    const strikingCell = newfieldCells.find((cell) => cell.id === strikingCard.cellId);
    const recievingCell = newfieldCells.find((cell) => cell.id === recievingCard.cellId);
    if (strikingCard.type !== 'hero'
      && (canRetaliate || retaliateSpells.length > 0 || retaliateStrikes.length > 0 || retributionSpells.length > 0)) {
      play({ id: 'sword' });
      dispatch(battleActions.addAnimation({ cellId: strikingCell.id, type: 'makeattack' }));
      dispatch(battleActions.addAnimation({ cellId: recievingCell.id, type: 'warAttacked' }));
    }
    const strikePower = canRetaliate ? getWarriorPower(strikingCard, 'defPower') : 0;
    const spellRetaliatePower = retaliateSpells.length > 0 ? calcAllSpellslValue({
      spells: retaliateSpells, aimCardPower: getWarriorPower(recievingCard), currentFieldCards: newfieldCards,
    }) : 0;

    const retaliateStrikePower = retaliateStrikes.length > 0 ? calcAllSpellslValue({
      spells: retaliateStrikes, aimCardPower: getWarriorPower(recievingCard), currentFieldCards: newfieldCards,
    }) : 0;

    const retributionPower = retributionSpells.length > 0 ? getWarriorPower(strikingCard, 'defPower') : 0;
    const totalStrikePower = strikePower + spellRetaliatePower + retaliateStrikePower + retributionPower;
    const recieveHealth = recievingCard.currentHP;
    const retaliateProtects = findSpells({
      attackingCard: strikingCard,
      defendingCard: recievingCard,
      type: strikingCard.subtype,
      spell: 'retaliateProtect',
      allFieldCells: newfieldCells,
      allFieldCards: newfieldCards,
      spellOwnerPoints: recieveCardOwnerPoints,
    });
    const retaliateProtectVal = retaliateProtects.length > 0
      ? getProtectionVal(retaliateProtects, totalStrikePower, recieveHealth) : 0;
    const calcRetaliatePower = totalStrikePower - retaliateProtectVal > 0
      ? totalStrikePower - retaliateProtectVal : 0;

    if (isKilled(calcRetaliatePower, recieveHealth)) {
      const destination = warHasSpecialFeature({
        warCard: recievingCard, fieldCards: newfieldCards, fieldCells: newfieldCells, featureName: 'returnable',
      }) ? 'return' : 'grave';
      sendCardFromField({
        card: recievingCard,
        castFunc: makeFeatureCast,
        destination,
        cardCost: null,
        cellsOnField: newfieldCells,
        gameTurn: gameturn,
      });
      moveAttachedSpells(recievingCard.cellId, null, 'kill');
    } else {
      changeCardHP(calcRetaliatePower, recieveHealth, recievingCard);
    }
    const powerSpells = strikingCard.attachments.filter((spell) => spell.name === 'power' || spell.name === 'defPower');
    powerSpells.forEach((spell) => changeChargedSpellCard(spell, newfieldCards, newfieldCells, makeFeatureCast));

    if (retaliateProtects.length > 0) {
      retaliateProtects.forEach((protectSpell) => changeChargedSpellCard(protectSpell, newfieldCards, newfieldCells, makeFeatureCast, gameturn));
      const totalCost = retaliateProtects.reduce((cost, spell) => {
        cost += spell.cost ?? 0;
        return cost;
      }, 0);
      dispatch(battleActions.setPlayerPoints({ points: recieveCardOwnerPoints - totalCost, player: recievingCard.player }));
    }
  };

  const prepareForAttack = ({
    attackingCard, attackedCard, attackedCell, curFieldCells, gameturn,
  }) => {
    const attackingCell = curFieldCells.find((cell) => cell.id === attackingCard.cellId);
    deleteImmediateSpells();
    handleAnimation(attackingCard, 'delete');
    dispatch(battleActions.deleteActiveCard({ player: attackingCard.player }));
    dispatch(battleActions.turnCardLeft({
      cardId: attackingCard.id,
      qty: 1,
    }));
    dispatch(battleActions.addAnimation({ cellId: attackingCell.id, type: 'makeattack' }));
    const onAttackSpells = findTriggerSpells(attackingCard, attackingCell, 'onattack', 'warrior', gameturn);
    onAttackSpells.forEach((spell) => {
      if (spell.apply === 'attacked') {
        makeFeatureCast({
          feature: spell, aimCell: attackedCell, applyingCard: null, player: attackedCard.player, player2Type: 'human',
        });
      } else {
        makeFeatureCast({
          feature: spell, aimCell: attackingCell, applyingCard: null, player: attackingCard.player, player2Type: 'human',
        });
      }
    });
    const gotAttackedSpells = findTriggerSpells(attackedCard, attackedCell, 'gotAttacked', 'warrior', gameturn);
    gotAttackedSpells.forEach((spell) => {
      makeFeatureCast({
        feature: spell, aimCell: attackedCell, applyingCard: null, player: attackedCard.player, player2Type: 'human',
      });
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

  const applySpellFeatures = ({
    card, cell, player, player2Type, performAIAction,
  }) => {
    card.features.forEach((feature) => {
      if (!feature.condition && !feature.attach) {
        makeFeatureCast({
          feature, aimCell: cell, applyingCard: null, player, player2Type, performAIAction,
        });
      } else if (feature.attach) {
        dispatch(battleActions.setLastCellWithAction({
          cellActionData: {
            id: cell.id, content: 1, source: card.status, type: card.type,
          },
        }));
        makeFeatureAttach(feature, cell, player, player2Type, performAIAction);
      }
    });
  };

  // APPLY SPELL CARD

  const applySpellCard = async ({
    card, cell, player, player2Type, performAIAction,
  }) => {
    if (player2Type === 'computer' && player === 'player2') {
      applySpellFeatures({
        card, cell, player, player2Type, performAIAction,
      });
      return;
    }
    await Promise.all(card.features.map((feature) => new Promise((resolve) => {
      setTimeout(() => {
        if (!feature.condition && !feature.attach) {
          makeFeatureCast({
            feature, aimCell: cell, applyingCard: null, player, player2Type, performAIAction,
          });
        } else if (feature.attach) {
          dispatch(battleActions.setLastCellWithAction({
            cellActionData: {
              id: cell.id, content: 1, source: card.status, type: card.type,
            },
          }));
          makeFeatureAttach(feature, cell, player, player2Type, performAIAction);
        }
        resolve();
      }, 700);
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
    changeChargedSpellCard,
    drawCards,
    sendCardToGraveAction,
    checkMeetCondition,
    canBeAttacked,
    canBeCast,
    canBeMoved,
    getActiveCard,
    findSpells,
    isHeroKilled,
    showVictoryWindow,
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
