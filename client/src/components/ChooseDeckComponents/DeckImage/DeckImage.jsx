import React from 'react';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { useNavigate } from 'react-router-dom';
import Cards from '@assets/deckBuilder/CardsIcon.svg';
import Lightning from '@assets/deckBuilder/LightningIcon.svg';
import Sword from '@assets/deckBuilder/SwordIcon.svg';
import Edit from '@assets/deckBuilder/Edit.svg';
import Cross from '@assets/deckBuilder/Multiply.svg';
import countDeckCards from '../../../utils/countDeckCards.js';
import { minDeckCards } from '../../../gameData/gameLimits.js';
import { actions as deckbuilderActions } from '../../../slices/deckbuilderSlice.js';
import gameCardsData from '../../../gameCardsData/index.js';
import styles from './DeckImage.module.css';

const DeckImage = ({
  deck, active,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { deckName, hero, cards } = deck;
  const { faction, name } = hero;
  const heroData = gameCardsData[faction][name];
  const { cardsNmb, spellsNmb, warriorsNmb } = countDeckCards(cards);

  const container = cn({
    [styles.container]: true,
    [styles.active]: active,
  });

  const handledDeckCLick = () => {
    dispatch(deckbuilderActions.setActiveDeck({ activeDeck: deckName }));
  };

  const handleEdit = () => {
    dispatch(deckbuilderActions.setChosenDeck({ chosenDeckName: deckName }));
    navigate('/deckbuilder');
  };

  const handleDelete = () => {
    dispatch(deckbuilderActions.setWarnWindow({ windowType: 'deleteDeck' }));
  };

  return (
    <div className={container}>
      <div className={styles.infoBlock}>
        <button className={styles.imageBlock} type="button" onClick={handledDeckCLick}>
          <img src={heroData.img} className={styles.heroImg} alt="hero icon" />
          <div className={styles.featBlock}>
            <img src={Cards} className={styles.icon} alt="cards" />
            <p className={styles.quantity} style={cardsNmb < minDeckCards ? { color: 'var(--red-light)' } : {}}>{cardsNmb}</p>
          </div>
          <div className={styles.featBlock}>
            <img src={Lightning} className={styles.icon} alt="cards" />
            <p className={styles.quantity}>{spellsNmb}</p>
          </div>
          <div className={styles.featBlock}>
            <img src={Sword} className={styles.icon} alt="cards" />
            <p className={styles.quantity}>{warriorsNmb}</p>
          </div>
        </button>
        {active && (
        <div className={styles.modifyBlock}>
          <button type="button" className={styles.modifyBtn} onClick={handleEdit}>
            <img src={Edit} alt="edit" className={styles.btnIcon} />
          </button>
          <button type="button" className={styles.deleteBtn} onClick={handleDelete}>
            <img src={Cross} alt="edit" className={styles.btnIcon} />
          </button>
        </div>
        )}
        <p className={styles.deckName}>{deckName}</p>
      </div>
    </div>
  );
};

export default DeckImage;
