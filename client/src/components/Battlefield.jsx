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
import './Battlefield.css';
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
    playerOneHand,
    playerTwoHand,
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
    <div className="battlefield__container">
      {windowWidth < 700 ? (
        <RotateScreen />
      ) : (
        <>
          <div className="battlefield__main">
            {thisPlayer === 'player1' ? (
              <div className="battlefield__hands-container">
                <Header setOpenMenu={setOpenMenu} isOpenMenu={isOpenMenu} />
                <div className="battlefield__heropad-1">
                  {activeCardPlayer1 && (
                  <ActiveCard activeCard={activeCardPlayer1} playerType="player1" />
                  )}
                  <HeroPad type="first" player={thisPlayer} />
                </div>
                <div className="battlefield__player-hand">
                  {playerOneHand.map((card) => (
                    <Card
                      key={card.id}
                      content={playerOneHand}
                      card={card}
                      activeCard={activeCardPlayer1}
                    />
                  ))}
                </div>
              </div>
            ) : (<HeroPad type="second" player="player1" />)}
            <div className="battlefield__core">
              <div className="battlefield__topspells">
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
              <div className="battlefield__middle-cells">
                <div className="battlefield__middle-fieldcells">
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
                <div className="battlefield__middle-spells">
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
                <div className="battlefield__middle-fieldcells">
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
              <div className="battlefield__hands-container">
                <Header setOpenMenu={setOpenMenu} isOpenMenu={isOpenMenu} />
                <div className="battlefield__heropad-2">
                  <HeroPad type="first" player={thisPlayer} />
                  {activeCardPlayer2 && (
                  <ActiveCard activeCard={activeCardPlayer2} playerType="player2" />
                  )}
                </div>
                <div className="battlefield__player-hand">
                  {playerTwoHand.map((card) => (
                    <Card
                      key={card.id}
                      content={playerTwoHand}
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
