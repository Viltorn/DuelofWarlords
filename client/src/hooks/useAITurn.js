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
import isHeroSpellAlLowed from '../utils/supportFunc/isHeroSpellAlLowed.js';
import findAICellsForWarDeploy from '../utils/aiFunctions/findAICellsForWarDeploy.js';
import getRandomFromArray from '../utils/getRandomFromArray.js';
import findAICellsForSpellCast from '../utils/aiFunctions/findAICellsForSpellCast.js';

const useAITurn = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const { addAnimatedCells, handleAnimation } = useAnimaActions();
  const { makeGameAction } = useFunctionsContext();
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const { roundNumber } = useSelector((state) => state.battleReducer);

  const isCardCanBeUsed = ({
    card, fieldCells, fieldCards, gameTurn, points, heroAICard,
  }) => {
    addAnimatedCells(card, fieldCells, fieldCards, gameTurn);
    const { activeCells } = store.getState().battleReducer;
    const isActiveCellsForCast = activeCells.cellsForSpellCast.length > 0;
    const isActiveCellsForWar = activeCells.cellsForWarMove.length > 0;
    const abilityButton = card.features.find((feat) => feat.condition === 'insteadatk' && (points - feat.cost) >= 0);
    if ((isActiveCellsForCast && isAllowedCost(card, points) && isHeroSpellAlLowed(card, heroAICard)) || (isActiveCellsForWar && isAllowedCost(card, points))) {
      handleAnimation(card, 'delete');
      return true;
    }
    if (abilityButton && isActiveCard(card) && isHeroSpellAlLowed(card, heroAICard)) {
      handleAnimation(card, 'delete');
      return true;
    }
    handleAnimation(card, 'delete');
    return false;
  };

  const performAIAction = ({
    card, points, fieldCards, fieldCells, room, gameTurn, ressurectSpell,
  }) => {
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
      console.log('resureccted');
      console.log(card);
      return;
    }
    const { activeCells } = store.getState().battleReducer;
    const { cellsForWarMove, cellsForSpellCast, cellsForAttack } = activeCells;
    if ((card.type === 'spell' || card.type === 'hero')) {
      const cardAbility = cellsForSpellCast.length > 0 && isAllowedCost(card, points) ? [card] : [];
      const cardAbilityButtons = card.features.filter((feat) => feat.condition === 'insteadatk' && (points - feat.cost) >= 0);
      const spellToUse = getRandomFromArray([...cardAbilityButtons, ...cardAbility]);
      if (spellToUse.condition === 'insteadatk') {
        console.log(spellToUse);
        const currentCell = fieldCells.find((item) => item.id === card.cellId);
        const abilityData = {
          move: 'makeAbilityCast',
          room,
          card,
          player: 'player2',
          player2Type: 'computer',
          points,
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
        const preferableCells = findAICellsForSpellCast(fieldCards, cellsForSpellCast, card);
        const cellToApply = getRandomFromArray(preferableCells);
        const curCell = fieldCells.find((c) => c.id === cellToApply);

        const actionData = {
          move: 'addCardToField',
          room: curRoom,
          card,
          player: 'player2',
          points,
          curCell,
          gameTurn,
          fieldCards,
          cellsOnField: fieldCells,
        };
        makeGameAction(actionData, gameMode);
        return;
      }
      console.log('apply spell');
      const preferableCells = findAICellsForSpellCast(fieldCards, cellsForSpellCast, card);
      const cellToApply = getRandomFromArray(preferableCells);
      const cell = fieldCells.find((c) => c.id === cellToApply);

      const actionData = {
        move: 'castSpell',
        room,
        card,
        player2Type: 'computer',
        performAIAction,
        player: 'player2',
        points,
        cell,
        gameTurn,
      };
      makeGameAction(actionData, gameMode);
      return;
    }
    if (card.type === 'warrior' && card.status === 'hand') {
      console.log('warrior deploy');
      const cellsToChooseFrom = findAICellsForWarDeploy(fieldCards, cellsForWarMove, card);
      const cellToApply = getRandomFromArray(cellsToChooseFrom);
      const curCell = fieldCells.find((c) => c.id === cellToApply);
      const actionData = {
        move: 'addCardToField',
        room: curRoom,
        card,
        player: 'player2',
        points,
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
    if (card.type === 'warrior' && card.status === 'field' && cellsForAttack.length > 0) {
      console.log('warrior attack');
      const cellToApply = getRandomFromArray(cellsForAttack);
      const warInCell = fieldCards.find((c) => c.cellId === cellToApply && (c.type === 'warrior' || c.type === 'hero'));
      const actionData = {
        move: 'makeFight',
        room: curRoom,
        card1: card,
        card2: warInCell,
        player2Type: 'computer',
        performAIAction,
        gameTurn,
      };
      makeGameAction(actionData, gameMode);
      return;
    }
    if (card.type === 'warrior' && card.status === 'field' && cellsForWarMove.length > 0) {
      console.log('warrior move');
      const cellToApply = getRandomFromArray(cellsForWarMove);
      const curCell = fieldCells.find((c) => c.id === cellToApply);
      const actionData = {
        move: 'addCardToField',
        room: curRoom,
        card,
        player: 'player2',
        points,
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
    if (card.type === 'warrior' && card.status === 'field') {
      const cardAbilityButtons = card.features.filter((feat) => feat.condition === 'insteadatk' && (points - feat.cost) >= 0);
      const spellToUse = getRandomFromArray(cardAbilityButtons);
      if (spellToUse) {
        console.log(spellToUse);
        const currentCell = fieldCells.find((item) => item.id === card.cellId);
        const abilityData = {
          move: 'makeAbilityCast',
          room,
          card,
          player: 'player2',
          player2Type: 'computer',
          points,
          gameTurn,
          performAIAction,
          cell: currentCell,
          ability: spellToUse,
        };
        makeGameAction(abilityData, gameMode);
        return;
      }
      dispatch(battleActions.turnCardLeft({ cardId: card.id, qty: 1 }));
    }
  };

  const getActionData = () => {
    const handAICards = store.getState().battleReducer.playersHands.player2;
    const pointsAI = store.getState().battleReducer.playerPoints.find((p) => p.player === 'player2').points;
    const { fieldCards, fieldCells, gameTurn } = store.getState().battleReducer;
    const fieldWarActiveAICards = fieldCards.filter((card) => card.player === 'player2' && card.type === 'warrior' && card.turn === 0 && card.status === 'field');
    const heroAICard = fieldCards.find((card) => card.type === 'hero' && card.player === 'player2');
    const handCardsToUse = heroAICard.turn === 0 ? [...handAICards, heroAICard] : handAICards;
    const cardsCanBeUsedFromHand = handCardsToUse.filter((card) => isCardCanBeUsed({
      card, fieldCells, fieldCards, gameTurn, points: pointsAI, heroAICard,
    }));
    const cardsToUse = cardsCanBeUsedFromHand.length > 0 ? cardsCanBeUsedFromHand : fieldWarActiveAICards;
    return {
      cardsToUse,
      pointsAI,
      fieldCards,
      fieldCells,
      gameTurn,
    };
  };

  const makeAIAction = (card, points, fieldCards, fieldCells, gameTurn) => {
    addAnimatedCells(card, fieldCells, fieldCards, gameTurn);
    dispatch(battleActions.addActiveCard({ card, player: 'player2' }));
    performAIAction({
      card, points, fieldCards, fieldCells, room: '', gameTurn,
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
    cards, points, curFieldCards, curFieldCells, curGameTurn,
  }) => {
    console.log(cards);
    console.log('use cards');
    const cardToUse = getRandomFromArray(cards);
    console.log(cardToUse);
    makeAIAction(cardToUse, points, curFieldCards, curFieldCells, curGameTurn);
    await new Promise((resolve) => {
      setTimeout(() => resolve(), 2000);
    });
    const {
      cardsToUse,
      pointsAI,
      fieldCards,
      fieldCells,
      gameTurn,
    } = getActionData();
    console.log(pointsAI);
    if (cardsToUse.length > 0) {
      performAIActions({
        cards: cardsToUse, points: pointsAI, curFieldCards: fieldCards, curFieldCells: fieldCells, curGameTurn: gameTurn,
      });
    } else {
      endAITurn(fieldCells, fieldCards, curRoom);
    }
  };

  const makeAITurn = () => {
    const {
      cardsToUse,
      pointsAI,
      fieldCards,
      fieldCells,
      gameTurn,
    } = getActionData();
    // if (fieldWarActiveAICards.length > 0) {
    //   console.log('make warrior move');
    //   const cardToUse = getRandomFromArray(fieldWarActiveAICards);
    //   makeAIAction(cardToUse, pointsAI, fieldCards, fieldCells, gameTurn);
    //   await new Promise((resolve) => {
    //     setTimeout(() => resolve(), 2000);
    //   });
    //   await performAIActions();
    // }
    // return new Promise((resolve) => { setTimeout(() => resolve(), 0); });
    if (cardsToUse.length > 0) {
      performAIActions({
        cards: cardsToUse, points: pointsAI, curFieldCards: fieldCards, curFieldCells: fieldCells, curGameTurn: gameTurn,
      });
    } else {
      endAITurn(fieldCells, fieldCards, curRoom);
    }

    // const { fieldCards, fieldCells } = store.getState().battleReducer;
  };

  return { makeAITurn, performAIAction };
};

export default useAITurn;
