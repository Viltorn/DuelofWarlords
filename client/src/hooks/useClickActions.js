import { actions as battleActions } from '@slices/battleSlice.js';
import { actions as modalsActions } from '@slices/modalsSlice.js';
import { actions as gameActions } from '@slices/gameSlice.js';
import { actions as uiActions } from '@slices/uiSlice.js';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { maxActionPoints } from '../gameData/gameLimits.js';
import useFunctionsContext from './useFunctionsContext.js';
import isPlayerDisconnected from '../utils/supportFunc/isPlayerDisconnected.js';
import useAITurn from './useAITurn.js';
import findTempSpellsOnField from '../utils/supportFunc/findTempSpellsOnField.js';
import findTurnSpellsOnField from '../utils/supportFunc/findTurnSpellsOnField.js';
import findReactSpellsOnField from '../utils/supportFunc/findReactSpellsOnField.js';
import useDeckBuilderActions from './useDeckBuilderActions.js';
import useBattleActions from './useBattleActions.js';
import isAllowedCost from '../utils/supportFunc/isAllowedCost.js';
import useAnimaActions from './useAnimaActions.js';
import socket from '../socket.js';

const useClickActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    thisPlayer,
    playerPoints,
    fieldCells,
    fieldCards,
    gameTurn,
    roundNumber,
    players,
  } = useSelector((state) => state.battleReducer);

  const { makeAITurn } = useAITurn();
  const { gameMode, curRoom, name } = useSelector((state) => state.gameReducer);
  const {
    setOpenMenu, actionPerforming, makeGameAction, toogleInfoWindow,
  } = useFunctionsContext();

  const { changeCardsInDeckBuilder } = useDeckBuilderActions();
  const {
    sendCardToGraveAction, changeTutorStep, getActiveCard, canBeCast,
    canBeMoved, invoking, canBeAttacked, addActiveCard,
  } = useBattleActions();

  const { handleAnimation } = useAnimaActions();

  const endTurnInTutorial = (newPoints) => {
    dispatch(battleActions.setPlayerPoints({ points: newPoints, player: 'player1' }));
    dispatch(battleActions.addCommonPoint());
    dispatch(battleActions.drawCard({ player: 'player1' }));
    dispatch(battleActions.turnPostponed({ player: 'player1', status: 'face' }));
    changeTutorStep((prev) => prev + 1);
  };

  const hadleEndTurnClick = () => {
    if (actionPerforming || (gameMode === 'online' && isPlayerDisconnected(players))) return;

    const { maxPoints } = playerPoints.find((p) => p.player === thisPlayer);
    const newPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    const newPoints = (maxPoints + 1) <= maxActionPoints ? maxPoints + 1 : maxPoints;
    if (gameMode === 'tutorial') {
      endTurnInTutorial(newPoints);
      return;
    }

    if (gameTurn !== thisPlayer) return;

    const currentRound = newPlayer === 'player1' ? roundNumber + 1 : roundNumber;
    const temporarySpells = findTempSpellsOnField(fieldCards, newPlayer);
    const reactionSpells = findReactSpellsOnField(fieldCards, newPlayer);
    const turnSpells = findTurnSpellsOnField(fieldCards, thisPlayer);

    const data = {
      move: 'endTurn',
      room: curRoom,
      newPlayer,
      newPoints,
      player2Type: players.player2.type,
      temporarySpells,
      turnSpells,
      reactionSpells,
      currentRound,
      cellsOnField: fieldCells,
      cardsOnField: fieldCards,
    };

    makeGameAction(data, gameMode);

    if (newPlayer === 'player2' && players.player2.type === 'computer') {
      makeAITurn();
    }
  };

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  const handleButtonClick = (data) => {
    const {
      btnType, card, ability, ressurect,
    } = data;
    if (actionPerforming || (gameMode === 'online' && isPlayerDisconnected(players))) return;

    const {
      cellId,
    } = card;
    const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
    const { maxPoints } = playerPoints.find((p) => p.player === thisPlayer);
    const cost = ressurect?.resCost ?? card.cost;
    const currentCell = fieldCells.find((item) => item.id === cellId);

    const returnData = {
      move: 'returnCardToHand',
      room: curRoom,
      card,
      player: thisPlayer,
      cost,
      spellId: ressurect?.id,
      cellsOnField: fieldCells,
      gameTurn,
    };

    const abilityData = {
      move: 'makeAbilityCast',
      room: curRoom,
      card,
      player2Type: 'human',
      performAIAction: null,
      player: thisPlayer,
      playerPoints,
      cell: currentCell,
      ability,
      gameTurn,
    };

    const deckRetData = {
      move: 'returnCardToDeck',
      room: curRoom,
      card,
      player: thisPlayer,
    };

    const sucrificeCardData = {
      move: 'sucrificeCard',
      room: curRoom,
      points: currentPoints + 1,
      maxPoints: maxPoints + 1,
      card,
      player: thisPlayer,
    };

    switch (btnType) {
      case 'addToDeck':
        changeCardsInDeckBuilder(card, 1);
        break;
      case 'deleteFromDeck':
        changeCardsInDeckBuilder(card, -1);
        break;
      case 'graveyard':
        sendCardToGraveAction(card, thisPlayer, fieldCells);
        break;
      case 'return':
        makeGameAction(returnData, gameMode);
        break;
      case 'sucrifice':
        makeGameAction(sucrificeCardData, gameMode);
        break;
      case 'ability':
        makeGameAction(abilityData, gameMode);
        break;
      case 'deckreturn':
        makeGameAction(deckRetData, gameMode);
        break;
      default:
        break;
    }
  };

  const handleCellClick = ({ type, currentCell, cellContent }) => {
    const activeCard = getActiveCard();
    const { points } = playerPoints.find((p) => p.player === thisPlayer);

    if (actionPerforming || (gameMode === 'online' && isPlayerDisconnected(players))) return;

    if (activeCard && !isAllowedCost(activeCard, points)) return;

    const isWarOnFieldCard = activeCard && activeCard.type === 'warrior' && type === 'field' && cellContent.length === 0;
    const isSpell = activeCard && activeCard.type === 'spell';

    if ((isWarOnFieldCard && canBeMoved(currentCell.id))
      || (isSpell && canBeCast(currentCell.id))) {
      const data = {
        move: 'addCardToField',
        room: curRoom,
        card: activeCard,
        player: thisPlayer,
        playerPoints,
        curCell: currentCell,
        fieldCards,
        cellsOnField: fieldCells,
        gameTurn,
      };
      makeGameAction(data, gameMode);
    }
  };

  const makeCardAction = (data) => {
    const {
      card,
      player,
      cell,
      appliedCard,
      spellsInCell,
    } = data;
    if (canBeCast(cell.id)) {
      handleAnimation(card, 'delete');
      const actionData = {
        move: 'castSpell',
        room: curRoom,
        card,
        player2Type: 'human',
        performAIAction: null,
        player,
        playerPoints,
        cell,
        gameTurn,
      };
      makeGameAction(actionData, gameMode);
      return;
    }
    if (canBeAttacked(appliedCard)) {
      const actionData = {
        move: 'makeFight',
        room: curRoom,
        card1: card,
        card2: appliedCard,
        gameTurn,
        playerPoints,
      };
      makeGameAction(actionData, gameMode);
      return;
    }
    if (appliedCard.subtype === 'reaction' && player !== appliedCard.player) {
      return;
    }
    if ((cell.type === 'field' || cell.type === 'hero') && appliedCard.type === 'spell') {
      dispatch(modalsActions.openModal({ type: 'openCheckCard', data: spellsInCell, id: 'attached' }));
      return;
    }
    handleAnimation(card, 'delete');
    toogleInfoWindow(false);
    addActiveCard(appliedCard, player);
    handleAnimation(appliedCard, 'add');
  };

  const handleCellCardClick = ({ item, cardElement }) => {
    if (actionPerforming || (gameMode === 'online' && isPlayerDisconnected(players))) return;
    if (invoking) return;
    const activeCard = getActiveCard();
    const cardId = cardElement?.current.id;
    if (activeCard?.ownerId === cardId) return;
    const currentCell = fieldCells.find((cell) => cell.id === item.cellId);
    const spellsInCell = fieldCards.filter((card) => card.cellId === item.cellId && card.type === 'spell');
    const activeId = activeCard?.id ?? null;

    if (activeId === cardId) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
      toogleInfoWindow(false);
    } else {
      makeCardAction({
        card: activeCard,
        player: thisPlayer,
        cell: currentCell,
        appliedCard: item,
        spellsInCell,
      });
    }
  };

  const handleDeckClick = ({ player }) => {
    if (actionPerforming || (gameMode === 'online' && isPlayerDisconnected(players))) return;
    if (gameTurn !== thisPlayer) return;

    const firstRound = roundNumber === 1;
    if (gameMode === 'test' && !firstRound) {
      dispatch(modalsActions.openModal({ type: 'openCheckCard', player, id: 'deck' }));
    }
  };

  const handlePointsClick = (pointsOwner) => {
    dispatch(modalsActions.openModal({ type: 'openPointsCounter', player: pointsOwner }));
  };

  const handleGraveyardClick = (player, graveCell) => {
    if (actionPerforming || (gameMode === 'online' && isPlayerDisconnected(players))) return;

    const activeCard = getActiveCard();
    const isSpell = activeCard && activeCard.type === 'spell';

    if ((isSpell && canBeCast(graveCell.id))) {
      handleAnimation(activeCard, 'delete');
      const actionData = {
        move: 'castSpell',
        room: curRoom,
        card: activeCard,
        player2Type: players.player2.type,
        performAIAction: null,
        player: activeCard.player,
        playerPoints,
        cell: graveCell,
        gameTurn,
      };
      makeGameAction(actionData, gameMode);
    } else {
      dispatch(modalsActions.openModal({ type: 'openCheckCard', player, id: 'grave' }));
    }
  };

  const handleCardClick = (card) => {
    const activeCard = getActiveCard();
    const activeId = activeCard ? activeCard.id : null;
    if (activeId !== card.id) {
      handleAnimation(activeCard, 'delete');
      dispatch(battleActions.addActiveCard({ card, player: thisPlayer }));
      handleAnimation(card, 'add');
    } else if (activeId) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
    }
    toogleInfoWindow(false);
  };

  const handleCardInfoClick = (card, active) => {
    if (active && gameMode !== 'builder') {
      toogleInfoWindow((prev) => !prev);
      return;
    }
    handleCardClick(card);
  };

  const handleBuilderCardClick = (e, card) => {
    e.stopPropagation();
    dispatch(modalsActions.openModal({ type: 'activeCardWindow', data: card }));
  };

  const handleResetGameClick = (dest) => {
    dispatch(battleActions.resetState());
    dispatch(uiActions.resetState());
    changeTutorStep(0);
    if (dest === 'reset' && (gameMode === 'hotseat' || gameMode === 'test')) {
      dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
      return;
    }
    if (dest === 'reset' && gameMode === 'tutorial') {
      dispatch(modalsActions.closeModal());
      return;
    }
    if (dest !== '/lobby') {
      dispatch(gameActions.resetState());
    }
    if (gameMode === 'online') {
      socket.emit('closeRoom', { roomId: curRoom, name }, (data) => {
        dispatch(gameActions.updateRooms({ rooms: data }));
      });
      dispatch(gameActions.setCurrentRoom({ room: '' }));
    }
    dispatch(modalsActions.closeModal());
    navigate(dest);
  };

  return {
    handleButtonClick,
    hadleEndTurnClick,
    handleMenuClick,
    handleCellClick,
    handleCellCardClick,
    handleDeckClick,
    handlePointsClick,
    handleGraveyardClick,
    handleCardClick,
    handleCardInfoClick,
    handleResetGameClick,
    handleBuilderCardClick,
  };
};

export default useClickActions;
