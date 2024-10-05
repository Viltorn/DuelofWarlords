import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import styles from './Card.module.css';
import useClickActions from '../../../hooks/useClickActions.js';

const Card = ({
  card, active, contentLength, builder,
}) => {
  const { t } = useTranslation();
  const cardElement = useRef();
  const {
    type,
    power,
    health,
    description,
    img,
    name,
    currentC,
    faction,
    school,
  } = card;
  const { handleCardClick, handleCardInfoClick } = useClickActions();
  const cardsFeature = faction ?? school;

  const marginRight = active || builder ? 0 : Math.min(contentLength * 0.5, 5.6);
  /*  empirical number */

  const classes = cn({
    [styles.cardBlock]: true,
    [styles.cardBlock_active]: active,
  });

  const descriptClasses = cn({
    [styles.fontActive]: active,
    [styles.font]: !active,
  });

  const titleClasses = cn({
    [styles.cardName]: true,
    [styles.nameLeft]: type === 'hero',
    [styles.cardNameActive]: type !== 'hero' && active,
    [styles.heroNameActive]: type === 'hero' && active,
  });

  const handleMouseEnter = () => {
    let nextSib = cardElement.current.nextSibling;
    while (nextSib) {
      nextSib.style.left = `${marginRight + 0.2}rem`;
      nextSib = nextSib.nextSibling;
    }
  };

  const handleMouseLeave = () => {
    let nextSib = cardElement.current.nextSibling;
    while (nextSib) {
      nextSib.style.left = 0;
      nextSib = nextSib.nextSibling;
    }
  };

  return (
    <div className={classes} ref={cardElement} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ marginRight: `-${marginRight}rem` }}>
      <button className={cn([styles.imageContainer], { [styles.active]: active })} type="button" onClick={() => handleCardClick(card)}>
        <h2 className={titleClasses}>{t(`titles.${cardsFeature}.${description}`)}</h2>
        {type === 'warrior' && (
        <>
          <h3 className={cn([styles.warriorPower], { [styles.active]: active })}>{power}</h3>
          <h3 className={cn([styles.warriorHealth], { [styles.active]: active })}>{health}</h3>
        </>
        )}
        {type !== 'hero' && (
          <h3 className={cn([styles.warriorCost], { [styles.active]: active })}>{currentC}</h3>
        )}
        {type === 'hero' && (
          <h3 className={styles.heroHealth}>{health}</h3>
        )}
        <img className={styles.mainImage} src={img} alt={name} />
      </button>
      <button className={styles.description} onClick={() => handleCardInfoClick(card, active)} type="button" aria-label="cardinfo">
        <p className={descriptClasses}>{t(`description.${cardsFeature}.${description}`)}</p>
      </button>
    </div>
  );
};

export default Card;
