/* eslint-disable max-len */
import {
  createContext, useState,
} from 'react';
import _ from 'lodash';
import { useDispatch, useStore, useSelector } from 'react-redux';
// import drumAudio from '@assets/DrumBeat.mp3';
// import useSound from 'use-sound';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as uiActions } from '../slices/uiSlice.js';
import isKilled from '../utils/supportFunc/isKilled.js';
import useBattleActions from '../hooks/useBattleActions.js';
import useResizeWindow from '../hooks/useResizeWindow.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import getProtectionVal from '../utils/supportFunc/getProtectionVal.js';
import useAnimaActions from '../hooks/useAnimaActions.js';
import isAttachFeatureAllowed from '../utils/supportFunc/isAttachFeatureAllowed.js';
import useUIActions from '../hooks/useUIActions.js';
import socket from '../socket.js';
import getEnemyPlayer from '../utils/supportFunc/getEnemyPlayer.js';
import useSoundEffects from '../hooks/useSoundEffects.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { play } = useSoundEffects();
  // const [play] = useSound(drumAudio, { volume: 0.3 });
  const store = useStore();
  const {
    activeCardPlayer1, activeCardPlayer2, thisPlayer, currentTutorStep,
  } = useSelector((state) => state.battleReducer);
  const { timer } = useSelector((state) => state.uiReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);
  const {
    deleteCardFromSource,
    changeCardHP,
    moveAttachedSpells,
    deleteOtherActiveCard,
    sendCardFromField,
    deleteImmediateSpells,
    changeChargedSpellCard,
    drawCards,
    makeFeatureCast,
    makeFeatureAttach,
    prepareForAttack,
    applySpellCard,
    findSpells,
    isHeroKilled,
    makeCounterStrike,
    showYourTurnWindow,
    showVictoryWindow,
  } = useBattleActions();
  const {
    handleAnimation,
    getWarriorPower,
    warHasSpecialFeature,
  } = useAnimaActions();
  const { resetTimer } = useUIActions();

  const fontVal = useResizeWindow();
  const [isOpenMenu, setOpenMenu] = useState(false);
  const [isOpenChat, setOpenChat] = useState(false);
  const [isOpenInfo, toogleInfoWindow] = useState(false);
  const [actionPerforming, setActionPerforming] = useState(false);
  // const [socket, setSocket] = useState(null);

  // useEffect(() => {
  //   window.addEventListener('beforeinstallprompt', (event) => {
  //     // Prevent the mini-infobar from appearing on mobile.
  //     event.preventDefault();
  //     // console.log('👍', 'beforeinstallprompt', event);
  //     // Stash the event so it can be triggered later.
  //     window.deferredPrompt = event;
  //     // Remove the 'hidden' class from the install button container.
  //   });
  // }, []);

  // MAKE FIGHT

  const makeFight = (actionData) => {
    const {
      card1, card2, player2Type, performAIAction, gameturn, playerPoints,
    } = actionData;
    const newfieldCells = store.getState().battleReducer.fieldCells;
    const newfieldCards = store.getState().battleReducer.fieldCards;
    const attackedCell = newfieldCells.find((cell) => cell.id === card2.cellId);

    if (gameMode === 'tutorial' && card1.player === 'player1') {
      dispatch(battleActions.setTutorialStep(currentTutorStep + 1));
    }

    prepareForAttack({
      attackingCard: card1,
      attackedCard: card2,
      attackedCell,
      curFieldCells: newfieldCells,
      gameturn,
    });

    const defendCardOwnerPoints = playerPoints.find((item) => item.player === card2.player).points;
    const attackCardOwnerPoints = playerPoints.find((item) => item.player === card1.player).points;
    const defaultSpellData = {
      attackingCard: card1, defendingCard: card2, allFieldCells: newfieldCells, allFieldCards: newfieldCards, spellOwnerPoints: defendCardOwnerPoints,
    };
    const evadeSpells = findSpells({ ...defaultSpellData, type: 'warrior', spell: 'evade' });
    if (evadeSpells.length > 0) {
      makeFeatureCast({
        feature: evadeSpells[0], aimCell: attackedCell, applyingCard: card2, player: card2.player, player2Type, performAIAction,
      });
      return;
    }

    const attackingInitPower = getWarriorPower(card1, 'atkPower');
    const attackingPowerFeature = card1.features.find((feat) => feat.name === 'power' && feat.aim.includes(card2.subtype));
    const attackingAddPower = attackingPowerFeature?.value || 0;
    const attackingPower = attackingInitPower + attackingAddPower;
    const attackedHealth = card2.currentHP;
    const protectSpells = findSpells({ ...defaultSpellData, type: card1.subtype, spell: 'protection' });
    const protectionVal = protectSpells.length > 0
      ? getProtectionVal(protectSpells, attackingPower, attackedHealth) : 0;

    const attachedRetaliates = findSpells({ ...defaultSpellData, type: card1.subtype, spell: 'retaliation' });
    const retaliateStrikes = findSpells({ ...defaultSpellData, type: card1.subtype, spell: 'retaliatestrike' });
    const retributionSpells = findSpells({ ...defaultSpellData, type: card1.subtype, spell: 'retribution' });
    const canRetaliate = card2.type !== 'hero' && card1.subtype !== 'shooter' && !warHasSpecialFeature({
      warCard: card1, fieldCards: newfieldCards, fieldCells: newfieldCells, featureName: 'ignoreRetalation',
    });

    const calculatedPower = attackingPower - protectionVal > 0
      ? attackingPower - protectionVal : 0;

    const attackingCell = newfieldCells.find((cell) => cell.id === card1.cellId);
    const powerSpells = [...card1.attachments.filter((spell) => spell.name === 'power' || spell.name === 'atkPower'),
      ...attackingCell.attachments.filter((spell) => (spell.name === 'power' || spell.name === 'atkPower') && spell.aim.includes(card1.subtype))];
    powerSpells.forEach((spell) => changeChargedSpellCard(spell, newfieldCards, newfieldCells, makeFeatureCast));

    if (protectSpells.length > 0) {
      protectSpells.forEach((protectSpell) => changeChargedSpellCard(protectSpell, newfieldCards, newfieldCells, makeFeatureCast, gameturn));
      const totalCost = protectSpells.reduce((cost, spell) => {
        cost += spell.cost ?? 0;
        return cost;
      }, 0);
      if (totalCost > 0) dispatch(battleActions.setPlayerPoints({ points: defendCardOwnerPoints - totalCost, player: card2.player }));
    }

    if (card1.subtype === 'shooter') {
      play({ id: 'bow' });
    } else {
      play({ id: 'sword' });
    }
    dispatch(battleActions.addAnimation({ cellId: attackedCell.id, type: 'warAttacked' }));
    if (isKilled(calculatedPower, attackedHealth)) {
      const destination = warHasSpecialFeature({
        warCard: card2, fieldCards: newfieldCards, fieldCells: newfieldCells, featureName: 'returnable',
      }) ? 'return' : 'grave';
      sendCardFromField({
        card: card2,
        castFunc: makeFeatureCast,
        destination,
        cardCost: null,
        cellsOnField: newfieldCells,
        gameTurn: gameturn,
      });
      moveAttachedSpells(card2.cellId, null, 'kill');
      setActionPerforming(false);
    }
    if (isKilled(calculatedPower, attackedHealth) && isHeroKilled(card2)) {
      showVictoryWindow(getEnemyPlayer(card2.player));
      changeCardHP(calculatedPower, attackedHealth, card2);
    }
    if (isKilled(calculatedPower, attackedHealth) && (retaliateStrikes.length > 0 || (canRetaliate && retributionSpells.length > 0))) {
      makeCounterStrike({
        strikingCard: card2,
        recievingCard: card1,
        canRetaliate: false,
        retaliateSpells: [],
        retaliateStrikes,
        retributionSpells,
        newfieldCells,
        newfieldCards,
        recieveCardOwnerPoints: attackCardOwnerPoints,
        gameturn,
      });
    }
    if (!isKilled(calculatedPower, attackedHealth)) {
      changeCardHP(calculatedPower, attackedHealth, card2);
      setTimeout(
        () => {
          makeCounterStrike({
            strikingCard: card2,
            recievingCard: card1,
            canRetaliate,
            retaliateSpells: attachedRetaliates,
            retaliateStrikes,
            retributionSpells: [],
            newfieldCells,
            newfieldCards,
            recieveCardOwnerPoints: attackCardOwnerPoints,
          });
          setActionPerforming(false);
        },
        1500,
      );
    }
    dispatch(battleActions.addActionToLog({
      playedCard: { warCard: true, cardName: card1.description, cardsFeature: card1.faction },
      aim: { warCard: true, cardName: card2.description, cardsFeature: card2.faction },
      id: _.uniqueId(),
    }));
  };

  // ADD CARD TO FIELD ///////

  const addCardToField = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, playerPoints, curCell, fieldCards, cellsOnField, player2Type, performAIAction,
    } = actionData;
    const cellId = curCell.id;
    const { points } = playerPoints.find((p) => p.player === player);
    if (gameMode === 'tutorial') {
      dispatch(battleActions.setTutorialStep(currentTutorStep + 1));
    }
    if (card.status === 'hand' && card.subtype !== 'reaction') {
      const newPoints = points - card.currentC;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    }
    const cardsFeature = card.school ?? card.faction;
    const warCard = fieldCards.find((c) => (c.type === 'warrior' || c.type === 'hero') && c.cellId === curCell.id);
    const aimData = warCard ? { warCard: true, cardName: warCard.description, cardsFeature: warCard.faction } : { cell: true, type: curCell.type };
    if (card.subtype !== 'reaction') dispatch(battleActions.addActionToLog({ playedCard: { warCard: true, cardName: card.description, cardsFeature }, aim: aimData, id: _.uniqueId() }));
    handleAnimation(card, 'delete');
    deleteCardFromSource(card);
    dispatch(battleActions.deleteActiveCard({ player }));
    if (card.name !== 'fake') {
      dispatch(battleActions.addFieldContent({ card, id: cellId }));
      dispatch(battleActions.setLastCellWithAction({
        cellActionData: {
          id: cellId, content: 1, source: card.status, type: card.type,
        },
      }));
    }
    if (card.type === 'warrior') {
      const attachSpells = card.features.filter((feat) => feat.attach && isAttachFeatureAllowed({ cardsCell: curCell, feature: feat }));
      attachSpells.forEach((spell) => makeFeatureAttach(spell, curCell, card.player, player2Type, performAIAction));
    }
    if (card.type === 'warrior' && card.status === 'field') {
      moveAttachedSpells(card.cellId, cellId, 'move', fieldCards);
      const movingFeature = warHasSpecialFeature({
        warCard: card, fieldCards, fieldCells: cellsOnField, featureName: 'moving',
      });
      const moveNextRowFeature = warHasSpecialFeature({
        warCard: card, fieldCards, fieldCells: cellsOnField, featureName: 'moveNextRow',
      });
      const moveNextAdjasentFeature = warHasSpecialFeature({
        warCard: card, fieldCards, fieldCells: cellsOnField, featureName: 'moveAdjasent',
      });
      const swiftFeature = warHasSpecialFeature({
        warCard: card, fieldCards, fieldCells: cellsOnField, featureName: 'swift',
      });
      if (!swiftFeature && card.player === player && !movingFeature && !moveNextRowFeature && !moveNextAdjasentFeature) {
        dispatch(battleActions.turnCardLeft({
          cardId: card.id,
          qty: 1,
        }));
      }
      [movingFeature, swiftFeature, moveNextRowFeature, moveNextAdjasentFeature]
        .forEach((spell) => changeChargedSpellCard(spell, fieldCards, cellsOnField, makeFeatureCast));
    }
    if (card.type === 'spell') {
      card.features
        .forEach((feature) => setTimeout(() => {
          if (!feature.condition && !feature.attach) {
            makeFeatureCast({
              feature, aimCell: curCell, applyingCard: null, player, player2Type, performAIAction,
            });
          } else if (feature.attach) {
            makeFeatureAttach(feature, curCell, player, player2Type, performAIAction);
          }
        }, 500));
    }
    if (card.status === 'hand') dispatch(battleActions.setLastPlayedCard(card));
    setActionPerforming(false);
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
    const trainingMode = gameMode === 'hotseat' || gameMode === 'test';
    dispatch(battleActions.setPlayerPoints({ points: newPoints, player: prevPlayer }));
    dispatch(battleActions.setPlayerMaxPoints({ maxPoints: newPoints, player: prevPlayer }));
    dispatch(battleActions.setCardSucrificeStatus({ player: prevPlayer, status: false }));
    if (trainingMode && player2Type === 'human') dispatch(battleActions.changePlayer({ newPlayer }));
    if (newPlayer === 'player1') dispatch(battleActions.changeRound());
    if (currentRound > 1) dispatch(battleActions.drawCard({ player: newPlayer }));

    handleAnimation(activeCardPlayer2, 'delete');
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
        const onTurnStartSpells = findTriggerSpells(card, cardsCell, 'onTurnStart', 'warrior', newPlayer);
        onTurnStartSpells.forEach((spell) => makeFeatureCast({
          feature: spell, aimCell: cardsCell, applyingCard: null, player: newPlayer, player2Type, performAIAction: null,
        }));
      });
    if (currentRound !== 1 && gameMode === 'online' && newPlayer === thisPlayer) {
      showYourTurnWindow();
      play({ id: 'drum' });
      // play();
    }
    const changeCardsAlowed = newPlayer === 'player2' && currentRound === 1 && player2Type === 'human';
    if ((changeCardsAlowed && trainingMode) || (changeCardsAlowed && thisPlayer === 'player2')) {
      dispatch(modalsActions.openModal({ type: 'startFirstRound', player: 'player2' }));
    }
    if (timer && thisPlayer === newPlayer) {
      console.log('reset');
      resetTimer();
      dispatch(uiActions.setTimerIsOver(false));
      dispatch(uiActions.setTimerIsPaused(false));
    }
    if (timer && thisPlayer !== newPlayer) {
      console.log('pause');
      resetTimer();
      dispatch(uiActions.setTimerIsOver(false));
      dispatch(uiActions.setTimerIsPaused(true));
    }
    dispatch(battleActions.addActionToLog({ round: currentRound, player: newPlayer, id: _.uniqueId() }));
    setActionPerforming(false);
  };

  // MAKE CAST SPELL

  const castSpell = async (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, playerPoints, cell, player2Type, performAIAction,
    } = actionData;
    const cardCardOwnerPoints = playerPoints.find((item) => item.player === player).points;
    if ((card.status === 'hand' && card.subtype !== 'reaction') || card.type === 'hero') {
      const newPoints = cardCardOwnerPoints - card.currentC;
      dispatch(battleActions.setPlayerPoints({ points: newPoints, player }));
    }
    dispatch(battleActions.deleteActiveCard({ player }));
    const cardsFeature = card.school ?? card.faction;
    const newfieldCards = store.getState().battleReducer.fieldCards;
    const warCard = newfieldCards.find((c) => (c.type === 'warrior' || c.type === 'hero') && c.cellId === cell.id && cell.type === 'field');
    const aimData = warCard ? { warCard: true, cardName: warCard.description, cardsFeature: warCard.faction } : { cell: true, type: cell.type };
    dispatch(battleActions.addActionToLog({ playedCard: { warCard: true, cardName: card.description, cardsFeature }, aim: aimData, id: _.uniqueId() }));

    await applySpellCard({
      card, cell, player, player2Type, performAIAction,
    });

    if (card.name !== 'fake' && card.type !== 'hero') {
      deleteCardFromSource(card);
      if (card.subtype === 'instant') {
        dispatch(battleActions.addToGraveyard({ card }));
      } else {
        dispatch(battleActions.addFieldContent({ card, id: cell.id }));
      }
    }
    if (cell.type === 'field' || cell.type === 'hero') {
      const attachFeat = card.features.find((f) => f.attach);
      const attachType = attachFeat && attachFeat?.type === 'good' ? 'buff' : 'deBuff';
      if (attachFeat) dispatch(battleActions.addAnimation({ cellId: cell.id, type: attachType }));
    }
    if (card.type === 'hero') {
      dispatch(battleActions.turnCardLeft({
        cardId: card.id,
        qty: 1,
      }));
    }
    if (gameMode === 'tutorial') {
      dispatch(battleActions.setTutorialStep(currentTutorStep + 1));
    }
    dispatch(battleActions.setLastPlayedCard(card));
    setActionPerforming(false);
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
      player,
      cardCost: cost,
      cellsOnField,
    });
    dispatch(battleActions.deleteAttachment({ spellId }));
    setActionPerforming(false);
  };

  // RETURN CARD TO OWNER'S DECK

  const returnCardToDeck = (actionData) => {
    deleteImmediateSpells();
    const { card, player } = actionData;
    handleAnimation(card, 'delete');
    dispatch(battleActions.sendCardtoDeck({ card }));
    deleteCardFromSource(card);
    dispatch(battleActions.deleteActiveCard({ player }));
    setActionPerforming(false);
  };

  // USE CARD ABILITY

  const makeAbilityCast = (actionData) => {
    deleteImmediateSpells();
    const {
      card, player, cell, ability, player2Type, performAIAction,
    } = actionData;
    handleAnimation(card, 'delete');
    dispatch(battleActions.deleteActiveCard({ player }));
    const cardsFeature = card.school ?? card.faction;
    dispatch(battleActions.addActionToLog({ playedCard: { warCard: true, cardName: card.description, cardsFeature }, aim: { ability: true, name: ability.description }, id: _.uniqueId() }));
    makeFeatureCast({
      feature: ability, aimCell: cell, applyingCard: card, player, player2Type, performAIAction,
    });
    if (card.type === 'spell') {
      deleteCardFromSource(card);
      dispatch(battleActions.addToGraveyard({ card }));
    }
    if (card.type !== 'spell') {
      dispatch(battleActions.turnCardLeft({ cardId: card.id, qty: 1 }));
    }
    if (gameMode === 'tutorial') {
      dispatch(battleActions.setTutorialStep(currentTutorStep + 1));
    }
    setActionPerforming(false);
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
    setActionPerforming(false);
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
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
