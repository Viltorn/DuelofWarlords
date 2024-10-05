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

const useAITurn = () => {
  const store = useStore();
  const dispatch = useDispatch();
  const { handleAnimation } = useAnimaActions();
  const { makeGameAction } = useFunctionsContext();
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const { roundNumber } = useSelector((state) => state.battleReducer);

  const getRandomFromArray = (arr) => {
    const maxIndex = arr.length - 1;
    const randomIndex = Math.floor(Math.random() * (maxIndex + 1));
    return arr[randomIndex];
  };

  const makeAIAction = (card, points, fieldCards, fieldCells) => {
    handleAnimation(card, 'add');
    dispatch(battleActions.addActiveCard({ card, player: 'player2' }));
    const { activeCells } = store.getState().battleReducer;
    if (card.type === 'spell' && card.type === 'hero') {
      const allCellsToApply = activeCells.cellsForSpellCast;
      const cellToApply = getRandomFromArray(allCellsToApply);
      const actionData = {
        move: 'castSpell',
        room: curRoom,
        card,
        player: 'player2',
        points,
        cell: cellToApply,
      };
      handleAnimation(card, 'delete');
      makeGameAction(actionData, gameMode);
    }
    if (card.type === 'warrior') {
      const allCellsToApply = activeCells.cellsForWarMove;
      const cellToApply = getRandomFromArray(allCellsToApply);
      const actionData = {
        move: 'addCardToField',
        room: curRoom,
        card,
        player: 'player2',
        points,
        curCell: cellToApply,
        fieldCards,
        cellsOnField: fieldCells,
      };
      makeGameAction(actionData, gameMode);
    }
  };

  const makeAITurn = async () => {
    const handAICards = store.getState().battleReducer.playersHands.player2;
    const pointsAI = store.getState().battleReducer.playerPoints.find((p) => p.player === 'player2').points;
    const { maxPoints } = store.getState().battleReducer.playerPoints.find((p) => p.player === 'player2');
    const { fieldCards, fieldCells } = store.getState().battleReducer;
    const fieldWarActiveAICards = fieldCards.filter((card) => card.player === 'player2' && card.type === 'warrior' && card.turn === 0);
    const heroAICard = fieldCards.find((card) => card.type === 'hero' && card.player === 'player2' && card.turn === 0);
    const handCardsToUse = heroAICard ? [...handAICards, heroAICard] : handAICards;
    const cardWithAllowCost = handCardsToUse.filter((card) => isAllowedCost(card, pointsAI));
    if (cardWithAllowCost.length > 0) {
      const cardToUse = getRandomFromArray(cardWithAllowCost);
      await new Promise((resolve) => {
        setTimeout(() => resolve(makeAIAction(cardToUse, pointsAI, fieldCards, fieldCells)), 1500);
      });
      makeAITurn();
    }
    if (fieldWarActiveAICards.length > 0) {
      const cardToUse = getRandomFromArray(fieldWarActiveAICards);
      await new Promise((resolve) => {
        setTimeout(() => resolve(makeAIAction(cardToUse, pointsAI, fieldCards, fieldCells)), 1500);
      });
      makeAITurn();
    }
    const currentRound = roundNumber + 1;
    const newPoints = (maxPoints + 1) <= maxActionPoints ? maxPoints + 1 : maxPoints;
    const temporarySpells = findTempSpellsOnField(fieldCards, 'player1');
    const reactionSpells = findReactSpellsOnField(fieldCards, 'player1');
    const turnSpells = findTurnSpellsOnField(fieldCards, 'player2');
    const data = {
      move: 'endTurn',
      room: curRoom,
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
    makeGameAction(data, gameMode);
  };

  return { makeAITurn };
};

export default useAITurn;
