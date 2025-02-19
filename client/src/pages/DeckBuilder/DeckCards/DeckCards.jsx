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
      <div className={styles.titleBlock}>
        <h2 className={styles.title}>{t('YourDeck')}</h2>
        <p className={styles.deckLimits}>{t('DeckLimits')}</p>
      </div>
      <div className={styles.cardBlock}>
        {hero && (
        <div className={styles.cardContainer} key={hero.name} role="button" onClickCapture={(e) => handleBuilderCardClick(e, hero)}>
          <Card
            builder
            card={hero}
            activeCard={activeCard}
          />
        </div>
        )}
        {cards.length !== 0 && (
          cards.map((el) => (
            <div className={styles.cardContainer} key={el.name} role="button" onClickCapture={(e) => handleBuilderCardClick(e, el)}>
              <div className={styles.counterBlock}>
                <img src={CardsCounter} alt="card counter" className={styles.counterImage} />
                <h3 className={styles.cardQty}>{el.qty}</h3>
              </div>
              <Card
                builder
                card={el}
                activeCard={activeCard}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default DeckCards;
