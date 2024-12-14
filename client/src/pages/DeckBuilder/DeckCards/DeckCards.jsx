import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@components/CardComponents/Card/Card';
import CardsCounter from '@assets/deckBuilderIcons/CardsCounter.png';
import useClickActions from '../../../hooks/useClickActions';
import styles from './DeckCards.module.css';

const DeckCards = ({ hero, cards, activeCard }) => {
  const { t } = useTranslation();
  const { handleBuilderCardClick } = useClickActions();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('YourDeck')}</h2>
      <div className={styles.cardBlock}>
        {hero && (
        <button className={styles.cardContainer} key={hero.name} type="button" onClickCapture={(e) => handleBuilderCardClick(e, hero)}>
          <Card
            builder
            card={hero}
            activeCard={activeCard}
          />
        </button>
        )}
        {cards.length !== 0 && (
          cards.map((el) => (
            <button className={styles.cardContainer} key={el.name} type="button" onClickCapture={(e) => handleBuilderCardClick(e, el)}>
              <div className={styles.counterBlock}>
                <img src={CardsCounter} alt="card counter" className={styles.counterImage} />
                <h3 className={styles.cardQty}>{el.qty}</h3>
              </div>
              <Card
                builder
                card={el}
                activeCard={activeCard}
              />
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default DeckCards;
