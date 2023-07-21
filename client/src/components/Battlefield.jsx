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
import getModal from '../modals/index.js';

const Battlefield = () => {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { activeCard, fieldCells, playerOneHand } = useSelector((state) => state.battleReducer);
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
  }, []);

  return (
    <div className="container">
      {windowWidth < 500 ? (
        <div className="rotate-screen">
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
                  <ActiveCard activeCard={activeCard} />
                )}
                <HeroPad player={1} cards={playerOneHand} />
              </div>
              <div className="player-hand">
                {playerOneHand.map((card) => (
                  <Card key={card.id} content={playerOneHand} card={card} player="player1" activeCard={activeCard} />
                ))}
              </div>
            </div>
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
            <HeroPad player={2} cards={playerOneHand} />
          </div>
          {renderModal(isOpened, type)}
        </>
      )}
    </div>
  );
};

export default Battlefield;
