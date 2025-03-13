import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@components/CardComponents/Card/Card';
import gameCardsData from '../../../gameCardsData/index';
import heroesList from '../../../gameCardsData/heroesList';
import useClickActions from '../../../hooks/useClickActions';
import styles from './AvailableCardsList.module.css';

const AvailableCardsList = ({ hero, cards, activeCard }) => {
  const { t } = useTranslation();
  const spellSchools = hero?.spellSchools;
  const faction = hero?.faction;

  const { handleBuilderCardClick } = useClickActions();

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('AvailableCards')}</h2>
      <div className={styles.cardsBlock}>
        {!hero && (
          heroesList.map((el) => {
            const data = { ...gameCardsData[el.faction][el.name], player: 'player1', qty: 0 };
            return (
              <div className={styles.cardContainer} key={el.name} type="button" onClickCapture={(e) => handleBuilderCardClick(e, data)}>
                <Card
                  builder
                  card={data}
                  activeCard={activeCard}
                />
              </div>
            );
          }))}
        {hero && (
          Object.values(gameCardsData[faction])
            .filter((el) => el.type !== 'hero' && !cards.some((card) => card.description === el.description) && el.name !== 'fake')
            .map((el) => {
              const card = { ...el, player: 'player1', qty: 0 };
              return (
                <div key={el.name} className={styles.cardContainer} type="button" onClickCapture={(e) => handleBuilderCardClick(e, card)}>
                  <Card
                    builder
                    card={card}
                    activeCard={activeCard}
                  />
                </div>
              );
            }))}
        {hero && (
          spellSchools.map((school) => (
            Object.values(gameCardsData[school])
              .filter((el) => !cards.some((card) => card.description === el.description) && el.name !== 'fake')
              .map((el) => {
                const card = { ...el, player: 'player1', qty: 0 };
                return (
                  <div key={el.name} className={styles.cardContainer} role="button" onClickCapture={(e) => handleBuilderCardClick(e, card)}>
                    <Card
                      builder
                      card={card}
                      activeCard={activeCard}
                    />
                  </div>
                );
              }))))}
      </div>
    </div>
  );
};

export default AvailableCardsList;
