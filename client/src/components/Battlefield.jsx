/* eslint-disable object-curly-newline */
import React, { useContext, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { useNavigate } from 'react-router-dom';
import socket from '../socket';
import Cell from './Cell.jsx';
import HeroPad from './HeroPad.jsx';
import Card from './Card.jsx';
import Header from './Header.jsx';
import RotateScreen from './RotateScreen.jsx';
import ActiveCard from './ActiveCard.jsx';
import InGameMenu from './InGameMenu/InGameMenu.jsx';
import styles from './Battlefield.module.css';
import getModal from '../modals/index.js';
import functionContext from '../contexts/functionsContext.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import AbilitiesContext from '../contexts/abilityActions';

const Battlefield = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { windowWidth } = useContext(functionContext);
  const {
    cellData,
    addCardToField,
    endTurn,
    drawCards,
    castSpell,
    makeFight,
    returnCardToHand,
    returnCardToDeck,
    makeAbilityCast,
  } = useContext(AbilitiesContext);
  const {
    activeCardPlayer1,
    activeCardPlayer2,
    fieldCells,
    playersHands,
    thisPlayer,
    players,
  } = useSelector((state) => state.battleReducer);
  const { gameMode, curRoom, socketId } = useSelector((state) => state.gameReducer);
  const thisPlayerName = useSelector((state) => state.gameReducer.name);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const cellsPlayer1 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player1' && cell.type === 'field'), [fieldCells]);
  const cellsPlayer2 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player2' && cell.type === 'field'), [fieldCells]);
  const topSpellsPlayer1 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player1' && cell.type === 'topSpell'), [fieldCells]);
  const topSpellsPlayer2 = useMemo(() => fieldCells.filter((cell) => cell.player === 'player2' && cell.type === 'topSpell'), [fieldCells]);
  const bigSpell = useMemo(() => fieldCells.find((cell) => cell.type === 'bigSpell'), [fieldCells]);
  const midPells = useMemo(() => fieldCells.filter((cell) => cell.type === 'midSpell'), [fieldCells]);

  const makeMove = useMemo(() => ({
    addCardToField: (data) => {
      const { card, player, points, cell } = data;
      addCardToField(card, player, points, cell);
    },
    endTurn: (data) => {
      const {
        newPlayer,
        commonPoints,
        newCommonPoints,
        posponedCell,
        temporarySpells,
        turnSpells,
      } = data;
      endTurn(newPlayer, commonPoints, newCommonPoints, posponedCell, temporarySpells, turnSpells);
    },
    castSpell: (data) => {
      const { card, player, points, cell } = data;
      castSpell(card, player, points, cell);
    },
    makeFight: (data) => {
      const { card1, card2 } = data;
      makeFight(card1, card2);
    },
    drawCards: (data) => {
      const { player, number } = data;
      drawCards(player, number);
    },
    returnCardToHand: (data) => {
      const { card, player, cost, spellId } = data;
      returnCardToHand(card, player, cost, spellId);
    },
    returnCardToDeck: (data) => {
      const { card, player } = data;
      returnCardToDeck(card, player);
    },
    makeAbilityCast: (data) => {
      const { card, player, points, cell, ability } = data;
      makeAbilityCast(card, player, points, cell, ability);
    },
    // eslint-disable-next-line
  }), []);

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal />;
  };

  useEffect(() => {
    if (gameMode === 'hotseat') {
      dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
    }
    if (gameMode === 'tutorial') {
      dispatch(modalsActions.openModal({ type: 'tutorial' }));
    }
  // eslint-disable-next-line
  }, [gameMode]);

  useEffect(() => {
    if (gameMode === 'online' && curRoom !== '') {
      const player1Name = players.player1.name;
      const player2Name = players.player2.name;
      if (player1Name === '' || player2Name === '') {
        dispatch(modalsActions.openModal({ type: 'waitForPlayer' }));
      } else {
        dispatch(modalsActions.closeModal());
      }
    }
  }, [players.player2.name, dispatch, gameMode, curRoom, players.player1.name]);

  useEffect(() => {
    socket.on('opponentJoined', (roomData) => {
      console.log('roomData', roomData);
      const { roomId } = roomData;
      const player1 = roomData.players[0];
      const player2 = roomData.players[1];
      dispatch(battleActions.setHero({ hero: player1.hero, player: 'player1' }));
      dispatch(battleActions.setHero({ hero: player2.hero, player: 'player2' }));
      dispatch(battleActions.setPlayersDeck({ deck: player1.deck, player: 'player1' }));
      dispatch(battleActions.setPlayersDeck({ deck: player2.deck, player: 'player2' }));
      dispatch(battleActions.setPlayersHand({ hand: player1.hand, player: 'player1' }));
      dispatch(battleActions.setPlayersHand({ hand: player2.hand, player: 'player2' }));
      dispatch(battleActions.setPlayerName({ name: player1.username, player: 'player1' }));
      dispatch(battleActions.setPlayerName({ name: player2.username, player: 'player2' }));
      dispatch(gameActions.setCurrentRoom({ room: roomId }));
    });
    socket.on('playerDisconnected', (player) => {
      dispatch(battleActions.setPlayerName({ name: '', player: player.type }));
    });

    socket.on('closeRoom', (data) => {
      const { roomId, name } = data;
      if (roomId === curRoom) {
        dispatch(modalsActions.openModal({ type: 'playerDisconnected', player: name, roomId: curRoom }));
        navigate('/lobby', { replace: true });
      }
    });

    socket.on('playerReconnected', (player) => {
      dispatch(battleActions.setPlayerName({ name: player.username, player: player.type }));
    });

    const handleThisPlayerDisc = () => {
      dispatch(battleActions.setPlayerName({ name: '', player: thisPlayer }));
    };

    const updateRoomsBattle = (data) => {
      dispatch(gameActions.updateRooms({ rooms: data }));
    };

    const updPlayersOnlieneBattle = (data) => {
      dispatch(gameActions.setOnlineCount({ count: data }));
      console.log(data);
    };

    const updateSocketIdBattle = (id) => {
      if (socketId !== id) {
        dispatch(gameActions.setSocketId({ socketId: id }));
        socket.emit('closeRoom', { roomId: curRoom, name: thisPlayerName }, (data) => {
          dispatch(gameActions.updateRooms({ rooms: data }));
        });
        navigate('/lobby');
        dispatch(gameActions.setPlayerName({ name: '' }));
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
  }, [dispatch, navigate, curRoom, addCardToField, endTurn, thisPlayer, socketId, thisPlayerName]);

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
    <div className={styles.container}>
      {windowWidth < 700 ? (
        <RotateScreen />
      ) : (
        <>
          <div className={styles.main}>
            {thisPlayer === 'player1' ? (
              <div className={styles.handsContainer}>
                <Header />
                <div className={styles.heropad1}>
                  {activeCardPlayer1 && (
                  <ActiveCard activeCard={activeCardPlayer1} playerType="player1" />
                  )}
                  <HeroPad type="first" player={thisPlayer} />
                </div>
                <div className={styles.playerHand}>
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
                          content={playersHands[thisPlayer]}
                          card={card}
                          activeCard={activeCardPlayer1}
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
                    cellData={cellData}
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
                  cellData={cellData}
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
                    cellData={cellData}
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
                      cellData={cellData}
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
                  {midPells.map((spell) => (
                    <Cell
                      key={spell.id}
                      id={spell.id}
                      cellData={cellData}
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
                      cellData={cellData}
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
                <div className={styles.heropad2}>
                  <HeroPad type="first" player={thisPlayer} />
                  {activeCardPlayer2 && (
                  <ActiveCard activeCard={activeCardPlayer2} playerType="player2" />
                  )}
                </div>
                <div className={styles.playerHand}>
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
                          content={playersHands[thisPlayer]}
                          card={card}
                          activeCard={activeCardPlayer2}
                        />
                      </CSSTransition>
                    ))}
                  </TransitionGroup>
                </div>
              </div>
            ) : (<HeroPad type="second" player="player2" />)}
          </div>
          {renderModal(isOpened, type)}
          <InGameMenu />
        </>
      )}
    </div>
  );
};

export default Battlefield;
