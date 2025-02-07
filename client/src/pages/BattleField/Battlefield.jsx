/* eslint-disable max-len */
/* eslint-disable object-curly-newline */
import React, { useEffect, useMemo, useRef, createRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useOrientation } from '@uidotdev/usehooks';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import socket from '../../socket.js';
import Cell from './Cell/Cell.jsx';
import HeroPad from './HeroPad/HeroPad.jsx';
import Card from '../../components/CardComponents/Card/Card.jsx';
import Header from './BattleHeader/BattleHeader.jsx';
import RotateScreen from '../../components/RotateScreen/RotateScreen.jsx';
import TutorialStepsWindow from '../../modals/TutorialModals/TutorialStepsWindow.jsx';
import ActiveCard from '../../components/CardComponents/ActiveCard/ActiveCard.jsx';
import ActiveCardInfo from '../../components/CardComponents/ActiveCard/ActiveCardInfo.jsx';
import InGameMenu from './InGameMenu/InGameMenu.jsx';
import styles from './Battlefield.module.css';
import getModal from '../../modals/index.js';
import { addPlayerToCard } from '../../utils/makeDeckForPlayer.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import { actions as uiActions } from '../../slices/uiSlice.js';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';
import useUIActions from '../../hooks/useUIActions.js';

const Battlefield = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const container = useRef(null);
  const main = useRef(null);
  const orientation = useOrientation();

  const {
    addCardToField, endTurn, makeMove, isOpenInfo,
  } = useFunctionsContext();
  const { setTimerPaused } = useUIActions();

  const {
    activeCardPlayer1,
    activeCardPlayer2,
    fieldCells,
    playersHands,
    thisPlayer,
    players,
    gameTurn,
    currentTutorStep,
  } = useSelector((state) => state.battleReducer);
  const { gameMode, curRoom, socketId } = useSelector((state) => state.gameReducer);
  const thisPlayerName = useSelector((state) => state.gameReducer.name);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const cellsPlayer1 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player1' && cell.type === 'field'), [fieldCells]);
  const cellsPlayer2 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player2' && cell.type === 'field'), [fieldCells]);
  const topSpellsPlayer1 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player1' && cell.type === 'topSpell'), [fieldCells]);
  const topSpellsPlayer2 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player2' && cell.type === 'topSpell'), [fieldCells]);
  const bigSpell = useMemo(() => fieldCells.find((cell) => cell.type === 'bigSpell'), [fieldCells]);
  const midSpells = useMemo(() => fieldCells.filter((cell) => cell.type === 'midSpell'), [fieldCells]);
  const activeCard = thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
  const playerHandCards = playersHands[thisPlayer].map((card) => ({ ...card, nodeRef: createRef(null) }));
  const contentLength = playersHands[thisPlayer].length;

  const handClasses = cn({
    [styles.playerHand]: true,
    [styles.fistRound]: type === 'startFirstRound',
  });

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal />;
  };

  useEffect(() => {
    socket.on('opponentJoined', (roomData) => {
      console.log('roomData', roomData);
      const { roomId, timer } = roomData;
      const player1 = roomData.players[0];
      const player2 = roomData.players[1];
      const player1Hero = addPlayerToCard(player1.hero, 'player1');
      const player2Hero = addPlayerToCard(player2.hero, 'player2');
      dispatch(battleActions.setHero({ hero: player1Hero, player: 'player1' }));
      dispatch(battleActions.setHero({ hero: player2Hero, player: 'player2' }));
      dispatch(battleActions.setPlayersDeck({ deck: player1.deck, player: 'player1' }));
      dispatch(battleActions.setPlayersDeck({ deck: player2.deck, player: 'player2' }));
      dispatch(battleActions.setPlayersHand({ hand: player1.hand, player: 'player1' }));
      dispatch(battleActions.setPlayersHand({ hand: player2.hand, player: 'player2' }));
      dispatch(battleActions.setPlayerName({ name: player1.username, player: 'player1' }));
      dispatch(battleActions.setPlayerName({ name: player2.username, player: 'player2' }));
      dispatch(uiActions.setCurTime([parseInt(timer, 10), parseInt(0, 10)]));
      dispatch(uiActions.setTimer(Number(timer)));
      dispatch(gameActions.setCurrentRoom({ room: roomId }));
      dispatch(modalsActions.openModal({ type: 'startFirstRound', player: 'player1' }));
    });

    socket.on('playerDisconnected', (player) => {
      dispatch(battleActions.setPlayerName({ name: '', player: player.type }));
      if (gameMode === 'online') dispatch(modalsActions.openModal({ type: 'waitForPlayer' }));
    });

    socket.on('closeRoom', (data) => {
      const { roomId, name } = data;
      if (roomId === curRoom) {
        navigate('/lobby', { replace: true });
        dispatch(modalsActions.openModal({ type: 'playerDisconnected', player: name, roomId: curRoom }));
      }
    });

    socket.on('playerReconnected', (player) => {
      dispatch(battleActions.setPlayerName({ name: player.username, player: player.type }));
      if (type === 'waitForPlayer' && !players[thisPlayer].cardsdrawn && gameTurn === thisPlayer) {
        dispatch(modalsActions.openModal({ type: 'startFirstRound', player: thisPlayer }));
      } else dispatch(modalsActions.closeModal());
    });

    const handleThisPlayerDisc = () => {
      dispatch(battleActions.setPlayerName({ name: '', player: thisPlayer }));
      if (gameMode === 'online') dispatch(modalsActions.openModal({ type: 'waitForPlayer' }));
    };

    const updateRoomsBattle = (data) => {
      dispatch(gameActions.updateRooms({ rooms: data }));
    };

    const updPlayersOnlieneBattle = (data) => {
      dispatch(gameActions.setOnlineCount({ count: data }));
    };

    const updateSocketIdBattle = (id) => {
      if (socketId !== id && gameMode === 'online') {
        dispatch(gameActions.setSocketId({ socketId: id }));
        socket.emit('closeRoom', { roomId: curRoom, name: thisPlayerName }, (data) => {
          dispatch(gameActions.updateRooms({ rooms: data }));
        });
        dispatch(modalsActions.openModal({ type: 'playerDisconnected', player: thisPlayerName, roomId: curRoom }));
        navigate('/lobby');
      }
    };

    socket.on('getSocketId', updateSocketIdBattle);
    socket.on('disconnect', handleThisPlayerDisc);
    socket.on('rooms', updateRoomsBattle);
    socket.on('clientsCount', updPlayersOnlieneBattle);

    return () => {
      socket.off('getSocketId', updateSocketIdBattle);
      socket.off('playerReconnected');
      socket.off('opponentJoined');
      socket.off('playerDisconnected');
      socket.off('disconnect', handleThisPlayerDisc);
      socket.off('closeRoom');
      socket.off('rooms', updateRoomsBattle);
      socket.off('clientsCount', updPlayersOnlieneBattle);
    };
  }, [dispatch,
    navigate,
    curRoom,
    addCardToField,
    endTurn,
    thisPlayer,
    socketId,
    thisPlayerName,
    gameMode,
    setTimerPaused,
    gameTurn,
    players,
    type,
  ]);

  useEffect(() => {
    socket.on('makeMove', (data) => {
      const { move } = data;
      makeMove[move](data);
    });

    return () => {
      socket.off('makeMove');
    };
  }, [makeMove]);

  return (
    <div className={styles.container} ref={container}>
      {orientation.type === 'portrait-primary' && (
        <RotateScreen />
      )}
      <div className={styles.main} ref={main}>
        {gameMode === 'tutorial' && currentTutorStep !== 0 && (
          <TutorialStepsWindow />
        )}
        {isOpenInfo && activeCard && (
        <ActiveCardInfo info={activeCard.featInfo} type={thisPlayer} />
        )}
        {thisPlayer === 'player1' ? (
          <div className={styles.handsContainer}>
            <Header />
            <InGameMenu />
            <div className={styles.heropad1}>
              {activeCardPlayer1 && (
              <ActiveCard activeCard={activeCardPlayer1} playerType="player1" info={isOpenInfo} />
              )}
              <HeroPad type="first" player={thisPlayer} />
            </div>
            <div className={handClasses}>
              <TransitionGroup component={null} exit>
                {playerHandCards.map((card) => (
                  <CSSTransition
                    key={card.id}
                    timeout={500}
                    classNames={{
                      enter: styles.cardAnimationEnter,
                      enterActive: styles.cardAnimationActive,
                      exit: styles.cardAnimationExit,
                      exitActive: styles.cardAnimationExitActive,
                    }}
                  >
                    <Card
                      key={card.id}
                      contentLength={contentLength}
                      card={card}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          </div>
        ) : (<HeroPad type="second" player="player1" />)}
        <div className={styles.core}>
          <div className={styles.topspells}>
            {topSpellsPlayer1.map((spell) => (
              <Cell
                key={spell.id}
                id={spell.id}
                props={{
                  animation: spell.animation,
                  content: spell.content,
                  type: 'topSpell',
                  status: 'active',
                }}
              />
            ))}
            <Cell
              key={bigSpell.id}
              id={bigSpell.id}
              props={{
                animation: bigSpell.animation,
                content: bigSpell.content,
                type: 'bigSpell',
                status: 'active',
              }}
            />
            {topSpellsPlayer2.map((spell) => (
              <Cell
                key={spell.id}
                id={spell.id}
                props={{
                  animation: spell.animation,
                  content: spell.content,
                  type: 'topSpell',
                  status: 'active',
                }}
              />
            ))}
          </div>
          <div className={styles.middleCells}>
            <div className={styles.middleFieldcells}>
              {cellsPlayer1.map((cell) => (
                <Cell
                  key={cell.id}
                  id={cell.id}
                  props={{
                    animation: cell.animation,
                    content: cell.content,
                    type: 'field',
                    status: 'active',
                    row: cell.row,
                    line: cell.line,
                  }}
                />
              ))}
            </div>
            <div className={styles.middleSpells}>
              {midSpells.map((spell) => (
                <Cell
                  key={spell.id}
                  id={spell.id}
                  props={{
                    animation: spell.animation,
                    content: spell.content,
                    type: 'midSpell',
                    status: 'active',
                  }}
                />
              ))}
            </div>
            <div className={styles.middleFieldcells}>
              {cellsPlayer2.map((cell) => (
                <Cell
                  key={cell.id}
                  id={cell.id}
                  props={{
                    animation: cell.animation,
                    content: cell.content,
                    type: 'field',
                    status: 'active',
                    row: cell.row,
                    line: cell.line,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
        {thisPlayer === 'player2' ? (
          <div className={styles.handsContainer}>
            <Header />
            <InGameMenu />
            <div className={styles.heropad2}>
              <HeroPad type="first" player={thisPlayer} />
              {activeCardPlayer2 && (
              <ActiveCard activeCard={activeCardPlayer2} playerType="player2" info={isOpenInfo} />
              )}
            </div>
            <div className={handClasses}>
              <TransitionGroup component={null} exit>
                {playersHands[thisPlayer].map((card) => (
                  <CSSTransition
                    key={card.id}
                    timeout={500}
                    classNames={{
                      enter: styles.cardAnimationEnter,
                      enterActive: styles.cardAnimationActive,
                      exit: styles.cardAnimationExit,
                      exitActive: styles.cardAnimationExitActive,
                    }}
                  >
                    <Card
                      key={card.id}
                      contentLength={contentLength}
                      card={card}
                      isOpenInfo={isOpenInfo}
                    />
                  </CSSTransition>
                ))}
              </TransitionGroup>
            </div>
          </div>
        ) : (<HeroPad type="second" player="player2" />)}
      </div>
      {renderModal(isOpened, type)}
    </div>
  );
};

export default Battlefield;
