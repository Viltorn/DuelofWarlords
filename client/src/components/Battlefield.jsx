/* eslint-disable object-curly-newline */
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Cell from './Cell.jsx';
import HeroPad from './HeroPad.jsx';
import HandCard from './HandCard.jsx';
import Header from './Header.jsx';
import ActiveCard from './ActiveCard.jsx';
import '../Battlefield.css';
import cards from '../cardsData/Academia.js';
import RotateScreen from '../assets/RotateScreen.png';

const rows = ['1', '2', '3', '4'];
const linesSideOne = ['1', '2'];
const linesSideTwo = ['3', '4'];

const Battlefield = () => {
  const { t } = useTranslation();
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const { activeCard } = useSelector((state) => state.battleReducer);

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
                <HeroPad player={1} cards={cards} />
              </div>
              <div className="player-hand">
                {cards.map((card, index) => (
                  <HandCard key={card.id} index={index} card={card} activeCard={activeCard} />
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
                  {rows.map((row) => (
                    linesSideOne.map((line) => (
                      <Cell
                        key={`${row}.${line}`}
                        id={`${row}.${line}`}
                        props={{
                          content: [cards[0]],
                          type: 'field',
                          status: 'active',
                          row,
                          line,
                        }}
                      />
                    ))
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
                  {rows.map((row) => (
                    linesSideTwo.map((line) => (
                      <Cell
                        key={`${row}.${line}`}
                        id={`${row}.${line}`}
                        props={{
                          content: [],
                          type: 'field',
                          status: 'active',
                          row,
                          line,
                        }}
                      />
                    ))
                  ))}
                </div>
              </div>
            </div>
            <HeroPad player={2} cards={cards} />
          </div>
        </>
      )}
    </div>
  );
};

export default Battlefield;
