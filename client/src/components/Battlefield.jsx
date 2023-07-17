/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Cell from './Cell.jsx';
import HeroPad from './HeroPad.jsx';
import Card from './Card.jsx';
import Header from './Header.jsx';
import ActiveCard from './ActiveCard.jsx';
import '../Battlefield.css';
import RotateScreen from '../assets/RotateScreen.png';

const rows = ['1', '2', '3', '4'];
const linesSideOne = ['1', '2'];
const linesSideTwo = ['3', '4'];

const Battlefield = () => {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { activeCard, fieldCells, playerOneHand } = useSelector((state) => state.battleReducer);
  const cellsPlayer1 = fieldCells.filter((cell) => cell.player === 'player1');
  const cellsPlayer2 = fieldCells.filter((cell) => cell.player === 'player2');

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
    };
  }, []);

  return (
    <div className="container">
      {windowWidth < 500 ? (
        <div className="flex-column">
          <h3>{t('RotateScreen')}</h3>
          <img className="rotate-img" src={RotateScreen} alt="rotate screen" />
        </div>
      ) : (
        <>
          <Header />
          <div className="battlefield-container">
            <div className="hands-container">
              <div className="hero-pad-container">
                {activeCard && (
                  <ActiveCard card={activeCard} activeCard={activeCard} />
                )}
                <HeroPad player={1} cards={playerOneHand} />
              </div>
              <div className="player-hand">
                {playerOneHand.map((card, index) => (
                  <Card key={card.id} index={index} card={card} player="player1" activeCard={activeCard} />
                ))}
              </div>
            </div>
            <div className="battlefield-core">
              <div className="battlefield-topspells">
                {linesSideOne.map((spell) => (
                  <Cell
                    key={spell}
                    id={spell}
                    props={{
                      content: [],
                      type: 'topSpell',
                      status: 'active',
                      line: spell,
                    }}
                  />
                ))}
                <Cell
                  key="bigSpell"
                  id="bigSpell"
                  props={{
                    content: [],
                    type: 'bigSpell',
                    status: 'active',
                  }}
                />
                {linesSideTwo.map((spell) => (
                  <Cell
                    key={spell}
                    id={spell}
                    props={{
                      content: [],
                      type: 'topSpell',
                      status: 'active',
                      line: spell,
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
                  {rows.map((row) => (
                    <Cell
                      key={`${row}.midSpell`}
                      id={`${row}.midSpell`}
                      props={{
                        content: [],
                        type: 'midSpell',
                        status: 'active',
                        row,
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
            <HeroPad player={2} cards={playerOneHand} />
          </div>
        </>
      )}
    </div>
  );
};

export default Battlefield;
