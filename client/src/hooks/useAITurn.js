/* eslint-disable max-len */
import { useStore, useSelector, useDispatch } from 'react-redux';
import { actions as battleActions } from '@slices/battleSlice.js';
import { maxActionPoints } from '../gameData/gameLimits.js';
import isAllowedCost from '../utils/supportFunc/isAllowedCost';
import useFunctionsContext from './useFunctionsContext.js';
import useAnimaActions from './useAnimaActions';
import findTempSpellsOnField from '../utils/supportFunc/findTempSpellsOnField.js';
import findTurnSpellsOnField from '../utils/supportFunc/findTurnSpellsOnField.js';
import findReactSpellsOnField from '../utils/supportFunc/findReactSpellsOnField.js';
import isActiveCard from '../utils/supportFunc/isActiveCard.js';
import findBestCellForWarDeploy from '../utils/aiFunctions/findBestCellForWarDeploy.js';
import getRandomFromArray from '../utils/getRandomFromArray.js';
import findBestCellForSpellCast from '../utils/aiFunctions/findBestCellForSpellCast.js';
import filterCardsEffectiveToPlay from '../utils/aiFunctions/filterCardsEffectiveToPlay.js';
import isAbilityCanBeUsed from '../utils/aiFunctions/isAbilityCanBeUsed.js';
import isFeatureCostAllowed from '../utils/supportFunc/isFeatureCostAllowed.js';
import isEnemyKilled from '../utils/aiFunctions/isEnemyKilled.js';
import isWarNeedToMove from '../utils/aiFunctions/isWarNeedToMove.js';
import findBestCellForWarAttack from '../utils/aiFunctions/findBestCellForWarAttack.js';
import useBattleActions from './useBattleActions.js';

const useAITurn = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const {
    addAnimatedCells, handleAnimation, getWarriorPower, warHasSpecialFeature,
  } = useAnimaActions();
  const { findSpells } = useBattleActions();
  const { makeGameAction } = useFunctionsContext();
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const { roundNumber } = useSelector((state) => state.battleReducer);

  const isCardCanBeUsed = ({
    card, fieldCells, fieldCards, gameTurn, aiPoints,
  }) => {
    addAnimatedCells(card, fieldCells, fieldCards, gameTurn);
    const { activeCells } = store.getState().battleReducer;
    const isActiveCellsForCast = activeCells.cellsForSpellCast.length > 0;
    const isActiveCellsForWar = activeCells.cellsForWarMove.length > 0;
    const abilityButton = card.features.find((feat) => feat.condition === 'insteadatk' && (aiPoints - feat.cost) >= 0 && !feat.attach && isAbilityCanBeUsed(feat, 'player2', fieldCards, fieldCells, warHasSpecialFeature));
    const attachedAbility = card.attachments?.find((feat) => feat.condition === 'insteadatk' && (aiPoints - feat.cost) >= 0 && isAbilityCanBeUsed(feat, 'player2', fieldCards, fieldCells, warHasSpecialFeature));
    if ((isActiveCellsForCast && isAllowedCost(card, aiPoints)) || (isActiveCellsForWar && isAllowedCost(card, aiPoints))) {
      handleAnimation(card, 'delete');
      return true;
    }
    if ((abilityButton || attachedAbility) && isActiveCard(card)) {
      handleAnimation(card, 'delete');
      return true;
    }
    handleAnimation(card, 'delete');
    return false;
  };

  const performAIAction = ({
    card, playerPoints, fieldCards, fieldCells, room, gameTurn, ressurectSpell,
  }) => {
    console.log('card to use');
    console.log(card);
    const aiPoints = playerPoints.find((p) => p.player === 'player2').points;
    const enemyPoints = playerPoints.find((p) => p.player === 'player1').points;
    if (ressurectSpell) {
      const cost = ressurectSpell?.resCost ?? card.cost;
      const returnData = {
        move: 'returnCardToHand',
        room: curRoom,
        card,
        player: 'player2',
        cost,
        spellId: ressurectSpell.id,
        cellsOnField: fieldCells,
        gameTurn,
      };
      makeGameAction(returnData, gameMode);
      console.log('resurrected');
      return;
    }
    const { activeCells } = store.getState().battleReducer;
    const { cellsForWarMove, cellsForSpellCast, cellsForAttack } = activeCells;
    if (card.description === 'Morale') {
      const drawCards = card.features.find((feat) => feat.name === 'drawCard');
      const abilityData = {
        move: 'makeAbilityCast',
        room,
        card,
        player: 'player2',
        player2Type: 'computer',
        playerPoints,
        gameTurn,
        performAIAction,
        cell: null,
        ability: drawCards,
      };
      makeGameAction(abilityData, gameMode);
      return;
    }
    const cardAbilities = card.features
      .filter((feat) => feat.condition === 'insteadatk' && isFeatureCostAllowed(feat, aiPoints) && !feat.attach && isAbilityCanBeUsed(feat, 'player2', fieldCards, fieldCells, warHasSpecialFeature));
    const attachedAbilities = card.attachments ? card.attachments
      .filter((feat) => feat.condition === 'insteadatk' && isFeatureCostAllowed(feat, aiPoints) && isAbilityCanBeUsed(feat, 'player2', fieldCards, fieldCells, warHasSpecialFeature)) : [];
    const abilitiesToUse = attachedAbilities.length > 0 ? attachedAbilities : cardAbilities;
    if ((card.type === 'spell' || card.type === 'hero')) {
      const cardSpell = cellsForSpellCast.length > 0 && isAllowedCost(card, aiPoints) ? [card] : [];
      const spellToUse = getRandomFromArray([...cardSpell, ...abilitiesToUse]);
      if (spellToUse.condition === 'insteadatk') {
        const currentCell = fieldCells.find((item) => item.id === card.cellId);
        const abilityData = {
          move: 'makeAbilityCast',
          room,
          card,
          player: 'player2',
          player2Type: 'computer',
          playerPoints,
          gameTurn,
          performAIAction,
          cell: currentCell,
          ability: spellToUse,
        };
        makeGameAction(abilityData, gameMode);
        return;
      }
      if (card.place && card.place !== '') {
        console.log('attach spell');
        const cellToApply = findBestCellForSpellCast({
          fieldCards, fieldCells, cellsForSpellCast, card, getWarriorPower, warHasSpecialFeature, findSpells, enemyPoints,
        });
        const curCell = fieldCells.find((c) => c.id === cellToApply);

        const actionData = {
          move: 'addCardToField',
          room: curRoom,
          card,
          player: 'player2',
          playerPoints,
          player2Type: 'computer',
          performAIAction,
          curCell,
          gameTurn,
          fieldCards,
          cellsOnField: fieldCells,
        };
        makeGameAction(actionData, gameMode);
        return;
      }
      console.log('apply spell');
      const cellToApply = findBestCellForSpellCast({
        fieldCards, fieldCells, cellsForSpellCast, card, getWarriorPower, warHasSpecialFeature, findSpells, enemyPoints,
      });
      const cell = fieldCells.find((c) => c.id === cellToApply);

      const actionData = {
        move: 'castSpell',
        room,
        card,
        player2Type: 'computer',
        performAIAction,
        player: 'player2',
        playerPoints,
        cell,
        gameTurn,
      };
      makeGameAction(actionData, gameMode);
      return;
    }
    if (card.type === 'warrior' && card.status === 'hand') {
      console.log('warrior deploy');
      const cellToApply = findBestCellForWarDeploy(fieldCards, cellsForWarMove, card);
      const curCell = fieldCells.find((c) => c.id === cellToApply);
      const actionData = {
        move: 'addCardToField',
        room: curRoom,
        card,
        player: 'player2',
        playerPoints,
        curCell,
        fieldCards,
        player2Type: 'computer',
        performAIAction,
        cellsOnField: fieldCells,
        gameTurn,
      };
      if (cellToApply) makeGameAction(actionData, gameMode);
      return;
    }

    const isWarBetterMove = isWarNeedToMove({
      warCard: card, fieldCards, fieldCells, findSpells, enemyPoints, getWarriorPower,
    });

    if (card.type === 'warrior' && card.status === 'field') {
      const warHasMovingFeature = warHasSpecialFeature({
        warCard: card, fieldCards, fieldCells, featureName: 'moving',
      }) || warHasSpecialFeature({
        warCard: card, fieldCards, fieldCells, featureName: 'moveNextRow',
      });
      const canMove = cellsForWarMove.length > 0;
      const canAttack = cellsForAttack.length > 0 && getWarriorPower(card) > 0;
      const canUseAblities = abilitiesToUse.length > 0;
      const chooseAbilityOverAtk = canUseAblities ? Math.round(Math.random()) > 0 : false;
      if (!isWarBetterMove && !warHasMovingFeature && canUseAblities && chooseAbilityOverAtk) {
        const spellToUse = getRandomFromArray([...abilitiesToUse, card]);
        const currentCell = fieldCells.find((item) => item.id === card.cellId);
        const abilityData = {
          move: 'makeAbilityCast',
          room,
          card,
          player: 'player2',
          player2Type: 'computer',
          playerPoints,
          gameTurn,
          performAIAction,
          cell: currentCell,
          ability: spellToUse,
        };
        makeGameAction(abilityData, gameMode);
        return;
      }
      if ((canAttack && !isWarBetterMove && !warHasMovingFeature)) {
        console.log('warrior attack');

        const cellToAttack = findBestCellForWarAttack({
          warCard: card, cellForAttackIds: cellsForAttack, fieldCards, fieldCells, enemyPoints, findSpells, getWarriorPower,
        });

        const warInCell = fieldCards.find((c) => c.cellId === cellToAttack && (c.type === 'warrior' || c.type === 'hero'));
        const actionData = {
          move: 'makeFight',
          room: curRoom,
          card1: card,
          card2: warInCell,
          player2Type: 'computer',
          playerPoints,
          performAIAction,
          gameTurn,
        };
        makeGameAction(actionData, gameMode);
        return;
      }

      if (canMove && (isWarBetterMove || warHasMovingFeature)) {
        console.log('warrior move');
        const cellToApply = findBestCellForWarDeploy(fieldCards, cellsForWarMove, card);
        const curCell = fieldCells.find((c) => c.id === cellToApply);
        const actionData = {
          move: 'addCardToField',
          room: curRoom,
          card,
          player: 'player2',
          playerPoints,
          curCell,
          fieldCards,
          player2Type: 'computer',
          performAIAction,
          cellsOnField: fieldCells,
          gameTurn,
        };
        makeGameAction(actionData, gameMode);
        return;
      }
      dispatch(battleActions.turnCardLeft({ cardId: card.id, qty: 1 }));
    }
  };

  const getActionData = () => {
    const handAICards = store.getState().battleReducer.playersHands.player2;
    const { playerPoints } = store.getState().battleReducer;
    const aiPoints = playerPoints.find((p) => p.player === 'player2').points;
    const enemyPoints = playerPoints.find((p) => p.player === 'player1').points;
    const { fieldCards, fieldCells, gameTurn } = store.getState().battleReducer;
    const fieldActiveFighters = fieldCards.filter((card) => card.player === 'player2' && card.subtype === 'fighter' && card.turn === 0 && card.status === 'field');
    const fieldActiveFlyersAndShooter = fieldCards.filter((card) => card.player === 'player2' && card.subtype !== 'fighter' && card.type === 'warrior' && card.turn === 0 && card.status === 'field');
    const fieldWarActiveAICards = fieldActiveFlyersAndShooter.length > 0 ? fieldActiveFlyersAndShooter : fieldActiveFighters;
    const heroAICard = fieldCards.find((card) => card.type === 'hero' && card.player === 'player2');
    const enemyHeroCard = fieldCards.find((card) => card.type === 'hero' && card.player === 'player1');
    const handCardsToUse = heroAICard.turn === 0 ? [...handAICards, heroAICard] : handAICards;
    const cardsCanBeUsedFromHand = handCardsToUse.filter((card) => isCardCanBeUsed({
      card, fieldCells, fieldCards, gameTurn, aiPoints,
    }));
    const effectiveCardsToPlay = filterCardsEffectiveToPlay({
      cards: cardsCanBeUsedFromHand, fieldCards, fieldCells, enemyPoints, getWarriorPower, findSpells, warHasSpecialFeature,
    });
    const cardsToUse = effectiveCardsToPlay.length > 0 ? effectiveCardsToPlay : fieldWarActiveAICards;
    return {
      cardsToUse,
      playerPoints,
      fieldCards,
      fieldCells,
      gameTurn,
      enemyHeroCard,
    };
  };

  const makeAIAction = (card, playerPoints, fieldCards, fieldCells, gameTurn) => {
    addAnimatedCells(card, fieldCells, fieldCards, gameTurn);
    dispatch(battleActions.addActiveCard({ card, player: 'player2' }));
    performAIAction({
      card, playerPoints, fieldCards, fieldCells, room: '', gameTurn,
    });
  };

  const endAITurn = (fieldCells, fieldCards, room) => {
    const { maxPoints } = store.getState().battleReducer.playerPoints.find((p) => p.player === 'player2');
    const currentRound = roundNumber + 1;
    const newPoints = (maxPoints + 1) <= maxActionPoints ? maxPoints + 1 : maxPoints;
    const temporarySpells = findTempSpellsOnField(fieldCards, 'player1');
    const reactionSpells = findReactSpellsOnField(fieldCards, 'player1');
    const turnSpells = findTurnSpellsOnField(fieldCards, 'player2');
    const data = {
      move: 'endTurn',
      room,
      newPlayer: 'player1',
      newPoints,
      player2Type: 'computer',
      temporarySpells,
      turnSpells,
      reactionSpells,
      currentRound,
      cellsOnField: fieldCells,
      cardsOnField: fieldCards,
    };
    console.log(`end AI turn ${roundNumber}`);
    makeGameAction(data, gameMode);
  };

  const performAIActions = async ({
    cards, allPoints, curFieldCards, curFieldCells, curGameTurn,
  }) => {
    console.log('use cards');
    const cardToUse = getRandomFromArray(cards);
    console.log(cardToUse);
    makeAIAction(cardToUse, allPoints, curFieldCards, curFieldCells, curGameTurn);
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
    const {
      cardsToUse,
      playerPoints,
      fieldCards,
      fieldCells,
      gameTurn,
      enemyHeroCard,
    } = getActionData();
    if (isEnemyKilled(enemyHeroCard)) {
      endAITurn(fieldCells, fieldCards, curRoom);
      return;
    }
    if (cardsToUse.length > 0) {
      performAIActions({
        cards: cardsToUse, allPoints: playerPoints, curFieldCards: fieldCards, curFieldCells: fieldCells, curGameTurn: gameTurn,
      });
    } else {
      endAITurn(fieldCells, fieldCards, curRoom);
    }
  };

  const makeAITurn = () => {
    const {
      cardsToUse,
      playerPoints,
      fieldCards,
      fieldCells,
      gameTurn,
    } = getActionData();

    if (cardsToUse.length > 0) {
      performAIActions({
        cards: cardsToUse, allPoints: playerPoints, curFieldCards: fieldCards, curFieldCells: fieldCells, curGameTurn: gameTurn,
      });
    } else {
      endAITurn(fieldCells, fieldCards, curRoom);
    }
  };

  return { makeAITurn, performAIAction };
};

export default useAITurn;
