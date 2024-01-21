import React from 'react';
import Card from '../Card/Card';
import CardsCounter from '../../assets/DeckBuilder/CardsCounter.svg';
import styles from './DeckCards.module.css';

const DeckCards = ({ hero, cards, activeCard }) => (
  <div className={styles.container}>
    {hero && (
      <Card
        key={hero.name}
        builder
        card={hero}
        activeCard={activeCard}
      />
    )}
    {cards.length !== 0 && (
      cards.map((el) => (
        <div className={styles.cardContainer} key={el.name}>
          <img src={CardsCounter} alt="card counter" className={styles.cardsCounter} />
          <h3 className={styles.cardQty}>{el.qty}</h3>
          <Card
            builder
            card={el}
            activeCard={activeCard}
          />
        </div>
      ))
    )}
  </div>
);

export default DeckCards;
