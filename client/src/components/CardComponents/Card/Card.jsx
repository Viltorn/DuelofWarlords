/* eslint-disable max-len */
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cn from 'classnames';
// import { actions as uiActions } from '../../../slices/uiSlice.js';
import styles from './Card.module.css';
import useClickActions from '../../../hooks/useClickActions.js';
import isAllowedCost from '../../../utils/supportFunc/isAllowedCost.js';

const Card = ({
  card, active, contentLength, builder, isOpenInfo,
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
    curCharges,
    showCharges,
    status,
  } = card;
  const { handleCardClick, handleCardInfoClick } = useClickActions();
  const { gameMode } = useSelector((state) => state.gameReducer);
  const { playerPoints, thisPlayer, gameTurn } = useSelector((state) => state.battleReducer);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const cardsFeature = faction ?? school;
  const marginRight = active || builder ? 0 : Math.min(contentLength * 0.5, 5.6);
  /*  empirical number */

  const classes = cn({
    [styles.cardBlock]: !active,
    [styles.bigCard]: isOpenInfo && active,
    [styles.cardBlock_active]: active,
    [styles.cardCanBePlayed]: !active && isAllowedCost(card, currentPoints) && gameMode !== 'build' && status === 'hand' && gameTurn === thisPlayer,
  });

  const descriptClasses = cn({
    [styles.fontActive]: active,
    [styles.font]: !active,
  });

  const titleClasses = cn({
    [styles.cardName]: true,
    [styles.nameLeft]: type === 'hero',
    [styles.cardNameActive]: type !== 'hero' && active,
    [styles.cardNameWindow]: isOpenInfo && active && gameMode === 'build' && type !== 'hero',
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

  // const setBigCard = () => {
  //   dispatch(uiActions.setBigCard(card));
  // };

  // const deleteBigCard = () => {
  //   dispatch(uiActions.resetState());
  // };

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
        {curCharges && showCharges
          ? (<h3 className={cn([styles.cardCharges], { [styles.active]: active })}>{curCharges}</h3>) : null}
        <img className={styles.mainImage} src={img} alt={name} />
      </button>
      <button className={styles.description} onClick={() => handleCardInfoClick(card, active)} type="button" aria-label="cardinfo">
        <p className={descriptClasses}>{t(`description.${cardsFeature}.${description}`)}</p>
      </button>
    </div>
  );
};

export default Card;
