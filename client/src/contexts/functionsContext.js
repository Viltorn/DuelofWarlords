/* eslint-disable max-len */
import {
  createContext, useEffect, useState,
} from 'react';
import { useDispatch, useStore, useSelector } from 'react-redux';
import useSound from 'use-sound';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import drumAudio from '../assets/DrumBeat.mp3';
import isKilled from '../utils/supportFunc/isKilled.js';
import useBattleActions from '../hooks/useBattleActions.js';
import useResizeWindow from '../hooks/useResizeWindow.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import getProtectionVal from '../utils/supportFunc/getProtectionVal.js';
import useAnimaActions from '../hooks/useAnimaActions.js';
// import socket from '../socket.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();
  const [play] = useSound(drumAudio, { volume: 0.3 });
  const {
    playerPoints, activeCardPlayer1, activeCardPlayer2,
  } = useSelector((state) => state.battleReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);
  const {
    deleteCardFromSource,
    changeCardHP,
    moveAttachedSpells,
    deleteOtherActiveCard,
    sendCardFromField,
    deleteImmediateSpells,
    deleteChargedSpellCard,
    drawCards,
    changeTutorStep,
    makeFeatureCast,
    makeFeatureAttach,
    prepareForAttack,
    applySpellCard,
    findSpell,
    checkIfIsVictory,
    makeCounterStrike,
    showYourTurnWindow,
  } = useBattleActions();
  const {
    handleAnimation,
    getWarriorPower,
  } = useAnimaActions();

  const fontVal = useResizeWindow();
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenChat, setOpenChat] = useState(false);
  const [isOpenInfo, toogleInfoWindow] = useState(false);
  const [actionPerforming, setActionPerforming] = useState(false);
  const [socket, setSocket] = useState(null);

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

  // MAKE FIGHT

  const makeFight = (actionData) => {
    const { card1, card2 } = actionData;
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const newfieldCards = store.getState().battleReducer.fieldCards;
    const attackedCell = newfieldCells.find((cell) => cell.id === card2.cellId);

    if (gameMode === 'tutorial' && card1.player === 'player1') {
      changeTutorStep((prev) => prev + 1);
    }

    prepareForAttack(card1, card2, attackedCell, newfieldCells);

    const defendCardOwnerPoints = playerPoints.find((item) => item.player === card2.player).points;
    const attackCardOwnerPoints = playerPoints.find((item) => item.player === card1.player).points;
    const defaultSpellData = {
      attackingCard: card1, defendingCard: card2, allFieldCells: newfieldCells, allFieldCards: newfieldCards, spellOwnerPoints: defendCardOwnerPoints,
    };
    const evade = findSpell({ ...defaultSpellData, type: 'warrior', spell: 'evade' });
    if (evade) {
      makeFeatureCast(evade, attackedCell, card2, card2.player);
      return;
    }

    const attackingInitPower = getWarriorPower(card1);
    const attackingPowerFeature = card1.features.find((feat) => feat.name === 'power' && feat.aim.includes(card2.subtype));
    const attackingAddPower = attackingPowerFeature?.value || 0;
    const attackingPower = attackingInitPower + attackingAddPower;
    const attackedHealth = card2.currentHP;
    const protectSpell = findSpell({ ...defaultSpellData, type: card1.subtype, spell: 'protection' });
    const protectionVal = protectSpell
      ? getProtectionVal(attackingPower, protectSpell, attackedHealth) : 0;

    const attachedRetaliate = findSpell({ ...defaultSpellData, type: card1.subtype, spell: 'retaliation' });
    const retaliateStrike = findSpell({ ...defaultSpellData, type: card1.subtype, spell: 'retaliatestrike' });
    const canRetaliate = card2.subtype !== 'shooter' && card2.type !== 'hero' && card1.subtype !== 'shooter';

    const calculatedPower = attackingPower - protectionVal > 0
      ? attackingPower - protectionVal : 0;

    const powerSpells = card1.attachments.filter((spell) => spell.name === 'power');
    powerSpells.forEach((spell) => {
      if (spell.charges === 1) deleteChargedSpellCard(spell, newfieldCards, newfieldCells, makeFeatureCast);
    });

    if (protectSpell && protectSpell.charges === 1) deleteChargedSpellCard(protectSpell, newfieldCards, newfieldCells, makeFeatureCast);

    if (protectSpell && protectSpell.cost) dispatch(battleActions.setPlayerPoints({ points: defendCardOwnerPoints - protectSpell.cost, player: protectSpell.player }));

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
    if (isKilled(calculatedPower, attackedHealth) && retaliateStrike) {
      makeCounterStrike({
        strikingCard: card2,
        recievingCard: card1,
        canRetaliate: null,
        retaliateSpell: null,
        retaliateStrike,
        newfieldCells,
        newfieldCards,
        recieveCardOwnerPoints: attackCardOwnerPoints,
      });
    }
    if (!isKilled(calculatedPower, attackedHealth)) {
      changeCardHP(calculatedPower, attackedHealth, card2);
    }
    if (!isKilled(calculatedPower, attackedHealth)) {
      makeCounterStrike({
        strikingCard: card2,
        recievingCard: card1,
        canRetaliate,
        retaliateSpell: attachedRetaliate,
        retaliateStrike,
        newfieldCells,
        newfieldCards,
        recieveCardOwnerPoints: attackCardOwnerPoints,
      });
    }
  };

  // ADD CARD TO FIELD ///////

  const addCardToField = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, points, curCell, fieldCards, cellsOnField,
    } = actionData;
    const cellId = curCell.id;
    if (gameMode === 'tutorial') {
      changeTutorStep((prev) => prev + 1);
    }
    if (card.status === 'hand' && card.subtype !== 'reaction') {
      const newPoints = points - card.currentC;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    }
    handleAnimation(card, 'delete');
    deleteCardFromSource(card);
    dispatch(battleActions.addFieldContent({ card, id: cellId }));
    dispatch(battleActions.deleteActiveCard({ player }));
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
      const movingAttachCells = curCell.attachments.find((feature) => feature.name === 'moving' || feature.name === 'moveNextRow');
      const hasSwift = card.features.find((feat) => feat.name === 'swift')
          || card.attachments.find((feature) => feature.name === 'swift');
      if (!hasSwift && card.player === player && !movingAttachment && !movingAttachCells) {
        dispatch(battleActions.turnCardLeft({
          cardId: card.id,
          qty: 1,
        }));
      }
      [movingAttachment, hasSwift, movingAttachCells]
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
      if (card.heroSpell) {
        const newfieldCards = store.getState().battleReducer.fieldCards;
        const heroCard = newfieldCards.find((c) => c.type === 'hero' && c.player === card.player);
        dispatch(battleActions.turnCardLeft({ cardId: heroCard.id, qty: 1 }));
      }
    }
  };

  // END TURN //////

  const endTurn = async (actionData) => {
    deleteImmediateSpells();
    const {
      newPlayer,
      newPoints,
      player2Type,
      temporarySpells,
      turnSpells,
      cardsOnField,
      cellsOnField,
      reactionSpells,
      currentRound,
    } = actionData;
    const prevPlayer = newPlayer === 'player1' ? 'player2' : 'player1';
    dispatch(battleActions.setPlayerPoints({ points: newPoints, player: prevPlayer }));
    dispatch(battleActions.setPlayerMaxPoints({ maxPoints: newPoints, player: prevPlayer }));
    dispatch(battleActions.setCardSucrificeStatus({ player: prevPlayer, status: false }));
    if (gameMode === 'hotseat' && player2Type === 'human') dispatch(battleActions.changePlayer({ newPlayer }));
    if (newPlayer === 'player1') dispatch(battleActions.changeRound());
    // if (postponedCell.status === 'face') {
    //   const card = cardsOnField.find((cardEl) => cardEl.cellId === postponedCell.id);
    //   sendCardFromField({
    //     card,
    //     castFunc: makeFeatureCast,
    //     destination: 'return',
    //     cardCost: null,
    //     cellsOnField,
    //   });
    //   dispatch(battleActions.deleteActiveCard({ player: prevPlayer }));
    //   deleteOtherActiveCard(activeCardPlayer1, activeCardPlayer2, prevPlayer);
    // }
    if (currentRound > 1) {
      dispatch(battleActions.drawCard({ player: newPlayer }));
    }
    handleAnimation(activeCardPlayer2, 'delete');
    dispatch(battleActions.turnPostponed({ player: newPlayer, status: 'face' }));
    dispatch(battleActions.massTurnCards({ player: newPlayer }));
    dispatch(battleActions.changeTurn({ player: newPlayer }));

    [...turnSpells, ...temporarySpells, ...reactionSpells].forEach((spell) => sendCardFromField({
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
    if (newPlayer === 'player1' || player2Type === 'human') {
      showYourTurnWindow();
      play();
    }
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

    await applySpellCard(card, cell, player);

    if (card.name !== 'fake' && card.type !== 'hero') {
      deleteCardFromSource(card);
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
    if (card.heroSpell) {
      const newfieldCards = store.getState().battleReducer.fieldCards;
      const heroCard = newfieldCards.find((c) => c.type === 'hero' && c.player === card.player);
      dispatch(battleActions.turnCardLeft({ cardId: heroCard.id, qty: 1 }));
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
    deleteCardFromSource(card);
    dispatch(battleActions.deleteActiveCard({ player }));
  };

  // USE CARD ABILITY

  const makeAbilityCast = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, cell, ability,
    } = actionData;
    handleAnimation(card, 'delete');
    dispatch(battleActions.deleteActiveCard({ player }));
    // const newPoints = points - ability.cost;
    // dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    if (!ability.attach) {
      makeFeatureCast(ability, cell, null, player);
    }
    if (ability.attach) {
      makeFeatureAttach(ability, cell, player);
    }
    if (card.type === 'spell') {
      deleteCardFromSource(card);
      dispatch(battleActions.addToGraveyard({ card }));
    } else {
      dispatch(battleActions.turnCardLeft({ cardId: card.id, qty: 1 }));
    }
    if (card.heroSpell) {
      const newfieldCards = store.getState().battleReducer.fieldCards;
      const heroCard = newfieldCards.find((c) => c.type === 'hero' && c.player === card.player);
      dispatch(battleActions.turnCardLeft({ cardId: heroCard.id, qty: 1 }));
    }
  };

  // SWITCH CARD

  const sucrificeCard = (actionData) => {
    deleteImmediateSpells();
    const { player, card } = actionData;
    // returnCardToDeck(actionData);
    handleAnimation(card, 'delete');
    deleteCardFromSource(card);
    dispatch(battleActions.deleteActiveCard({ player }));
    // dispatch(battleActions.setPlayerPoints({ points, player }));
    dispatch(battleActions.drawCard({ player }));
    dispatch(battleActions.setCardSucrificeStatus({ player, status: true }));
  };

  // MAKE ONLINE ACTION

  const makeMove = {
    addCardToField: (data) => addCardToField(data),
    endTurn: (data) => endTurn(data),
    castSpell: (data) => castSpell(data),
    makeFight: (data) => makeFight(data),
    drawCards: (data) => drawCards(data),
    sucrificeCard: (data) => sucrificeCard(data),
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
      isOpenMenu,
      setOpenMenu,
      fontVal,
      isOpenChat,
      setOpenChat,
      isOpenInfo,
      toogleInfoWindow,
      makeGameAction,
      drawCards,
      actionPerforming,
      makeMove,
      socket,
      setSocket,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
