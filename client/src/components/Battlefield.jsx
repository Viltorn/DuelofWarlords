/* eslint-disable object-curly-newline */
import React from 'react';
import Cell from './Cell.jsx';
import HeroPad from './HeroPad.jsx';
import HandCard from './HandCard.jsx';
import '../Battlefield.css';
import cards from '../cardsData/Academia.js';

const rows = ['1', '2', '3', '4'];
const linesSideOne = ['1', '2'];
const linesSideTwo = ['3', '4'];

const Battlefield = () => (
  <div className="container">
    <div className="battlefield-container">
      <div className="hands-container">
        <HeroPad player={1} cards={cards} />
        <div className="player-hand">
          {cards.map((card, index) => (
            <HandCard key={card.id} index={index} card={card} player="Player1" />
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
  </div>
);

export default Battlefield;
