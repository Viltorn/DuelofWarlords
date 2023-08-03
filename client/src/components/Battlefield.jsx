/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Cell from './Cell.jsx';
import HeroPad from './HeroPad.jsx';
import Card from './Card.jsx';
import Header from './Header.jsx';
import ActiveCard from './ActiveCard.jsx';
import './Battlefield.css';
import RotateScreen from '../assets/battlefield/RotateScreen.png';
import getModal from '../modals/index.js';

const Battlefield = () => {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const {
    activeCardPlayer1,
    activeCardPlayer2,
    fieldCells,
    playerOneHand,
    playerTwoHand,
    thisPlayer,
  } = useSelector((state) => state.battleReducer);
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
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  });

  return (
    <div className="container">
      {windowWidth < 500 ? (
        <div className="rotate-screen">
          <h2>{t('RotateScreen')}</h2>
          <img className="rotate-img" src={RotateScreen} alt="rotate screen" />
        </div>
      ) : (
        <>
          <Header />
          <div className="battlefield-container">
            {thisPlayer === 'player1' ? (
              <div className="hands-container">
                <div className="hero-pad-container-1">
                  {activeCardPlayer1 && (
                  <ActiveCard activeCard={activeCardPlayer1} playerType="player1" />
                  )}
                  <HeroPad type="first" player={thisPlayer} />
                </div>
                <div className="player-hand">
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
            <div className="battlefield-core">
              <div className="battlefield-topspells">
                {topSpellsPlayer1.map((spell) => (
                  <Cell
                    key={spell.id}
                    id={spell.id}
                    props={{
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
                      content: spell.content,
                      type: 'topSpell',
                      status: 'active',
                    }}
                  />
                ))}
              </div>
              <div className="battlefield-center">
                <div className="battlefield-side-container">
                  {cellsPlayer1.map((cell) => (
                    <Cell
                      key={cell.id}
                      id={cell.id}
                      props={{
                        content: cell.content,
                        type: 'field',
                        status: 'active',
                        row: cell.row,
                        line: cell.line,
                      }}
                    />
                  ))}
                </div>
                <div className="battlefield-midspell-container">
                  {midPells.map((spell) => (
                    <Cell
                      key={spell.id}
                      id={spell.id}
                      props={{
                        content: spell.content,
                        type: 'midSpell',
                        status: 'active',
                      }}
                    />
                  ))}
                </div>
                <div className="battlefield-side-container">
                  {cellsPlayer2.map((cell) => (
                    <Cell
                      key={cell.id}
                      id={cell.id}
                      props={{
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
              <div className="hands-container">
                <div className="hero-pad-container-2">
                  <HeroPad type="first" player={thisPlayer} />
                  {activeCardPlayer2 && (
                  <ActiveCard activeCard={activeCardPlayer2} playerType="player2" />
                  )}
                </div>
                <div className="player-hand">
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
        </>
      )}
    </div>
  );
};

export default Battlefield;
