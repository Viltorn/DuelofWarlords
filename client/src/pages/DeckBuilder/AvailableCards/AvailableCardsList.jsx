import React from 'react';
import { useTranslation } from 'react-i18next';
import Card from '@components/CardComponents/Card/Card';
import gameCardsData from '../../../gameCardsData/index';
import heroesList from '../../../gameCardsData/heroesList';
import styles from './AvailableCardsList.module.css';

const AvailableCardsList = ({ hero, cards, activeCard }) => {
  const { t } = useTranslation();
  const spellSchools = hero?.spellSchools;
  const faction = hero?.faction;
  console.log(faction);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{t('AvailableCards')}</h2>
      <div className={styles.cardsBlock}>
        {!hero && (
          heroesList.map((el) => {
            const data = { ...gameCardsData[el.faction][el.name], player: 'player1', qty: 0 };
            return (
              <Card
                key={el.name}
                builder
                card={data}
                activeCard={activeCard}
              />
            );
          }))}
        {hero && (
          Object.values(gameCardsData[faction])
            .filter((el) => el.type !== 'hero' && !cards.some((card) => card.description === el.description))
            .map((el) => (
              <Card
                key={el.name}
                builder
                card={{ ...el, player: 'player1', qty: 0 }}
                activeCard={activeCard}
              />
            )))}
        {hero && (
          spellSchools.map((school) => (
            Object.values(gameCardsData[school])
              .filter((el) => !cards.some((card) => card.description === el.description))
              .map((el) => (
                <Card
                  key={el.name}
                  builder
                  card={{ ...el, player: 'player1', qty: 0 }}
                  activeCard={activeCard}
                />
              ))
          )))}
      </div>
    </div>
  );
};

export default AvailableCardsList;
