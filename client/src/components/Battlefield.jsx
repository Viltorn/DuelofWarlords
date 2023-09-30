/* eslint-disable object-curly-newline */
import React, { useContext, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
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

const Battlefield = () => {
  const dispatch = useDispatch();
  const { windowWidth } = useContext(functionContext);
  const {
    activeCardPlayer1,
    activeCardPlayer2,
    fieldCells,
    playersHands,
    thisPlayer,
  } = useSelector((state) => state.battleReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);
  const [isOpenMenu, setOpenMenu] = useState(false);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const cellsPlayer1 = fieldCells.filter((cell) => cell.player === 'player1' && cell.type === 'field');
  const cellsPlayer2 = fieldCells.filter((cell) => cell.player === 'player2' && cell.type === 'field');
  const topSpellsPlayer1 = fieldCells.filter((cell) => cell.player === 'player1' && cell.type === 'topSpell');
  const topSpellsPlayer2 = fieldCells.filter((cell) => cell.player === 'player2' && cell.type === 'topSpell');
  const bigSpell = fieldCells.find((cell) => cell.type === 'bigSpell');
  const midPells = fieldCells.filter((cell) => cell.type === 'midSpell');

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
    } else if (gameMode === 'tutorial') {
      dispatch(modalsActions.openModal({ type: 'tutorial' }));
    }
  // eslint-disable-next-line
  }, [gameMode]);

  return (
    <div className={styles.container}>
      {windowWidth < 700 ? (
        <RotateScreen />
      ) : (
        <>
          <div className={styles.main}>
            {thisPlayer === 'player1' ? (
              <div className={styles.handsContainer}>
                <Header setOpenMenu={setOpenMenu} isOpenMenu={isOpenMenu} />
                <div className={styles.heropad1}>
                  {activeCardPlayer1 && (
                  <ActiveCard activeCard={activeCardPlayer1} playerType="player1" />
                  )}
                  <HeroPad type="first" player={thisPlayer} />
                </div>
                <div className={styles.playerHand}>
                  {playersHands[thisPlayer].map((card) => (
                    <Card
                      key={card.id}
                      content={playersHands[thisPlayer]}
                      card={card}
                      activeCard={activeCardPlayer1}
                    />
                  ))}
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
                  {midPells.map((spell) => (
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
                <Header setOpenMenu={setOpenMenu} isOpenMenu={isOpenMenu} />
                <div className={styles.heropad2}>
                  <HeroPad type="first" player={thisPlayer} />
                  {activeCardPlayer2 && (
                  <ActiveCard activeCard={activeCardPlayer2} playerType="player2" />
                  )}
                </div>
                <div className={styles.playerHand}>
                  {playersHands[thisPlayer].map((card) => (
                    <Card
                      key={card.id}
                      content={playersHands[thisPlayer]}
                      card={card}
                      activeCard={activeCardPlayer2}
                    />
                  ))}
                </div>
              </div>
            ) : (<HeroPad type="second" player="player2" />)}
          </div>
          {renderModal(isOpened, type)}
          <InGameMenu isOpenMenu={isOpenMenu} setOpenMenu={setOpenMenu} />
        </>
      )}
    </div>
  );
};

export default Battlefield;
