/* eslint-disable max-len */
import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import WarShield from '@assets/WarShieldIcon.png';
import CostIcon from '@assets/ActionPointsCounter.png';
import icons from '../../../gameData/animationIcons';
import styles from './Card.module.css';
import useClickActions from '../../../hooks/useClickActions.js';
import useAnimaActions from '../../../hooks/useAnimaActions.js';
import isAllowedCost from '../../../utils/supportFunc/isAllowedCost.js';

const Card = forwardRef(({
  card, active, contentLength, builder, isOpenInfo, log,
}, ref) => {
  const { t } = useTranslation();
  const {
    type,
    description,
    img,
    name,
    currentP,
    currentDP,
    currentC,
    currentHP,
    faction,
    school,
    curCharges,
    showCharges,
    status,
  } = card;
  const { handleCardClick, handleCardInfoClick } = useClickActions();
  const { getWarriorPower, warTokensData } = useAnimaActions();
  const { gameMode } = useSelector((state) => state.gameReducer);
  const {
    playerPoints, thisPlayer, gameTurn, fieldCells, fieldCards,
  } = useSelector((state) => state.battleReducer);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const cardsFeature = faction ?? school;
  const marginRight = active || builder || log ? 0 : Math.min(contentLength * 0.5, 5.6);
  const atkPower = card.type === 'warrior' && status !== 'hand' ? getWarriorPower(card, 'atkPower') : currentP;
  const defPower = card.type === 'warrior' && status !== 'hand' ? getWarriorPower(card, 'defPower') : currentDP;
  const warTokens = (type === 'warrior' || type === 'hero') ? warTokensData({ warCard: card, fieldCells, fieldCards }) : null;
  const bigCard = isOpenInfo && active;
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

  const tokenIcon = cn({
    [styles.tokenIcon]: !active,
    [styles.tokenIconBig]: active,
  });

  const handleMouseEnter = () => {
    let nextSib = ref?.current.nextSibling;
    while (nextSib) {
      nextSib.style.left = `${marginRight + 0.2}rem`;
      nextSib = nextSib.nextSibling;
    }
  };

  const handleMouseLeave = () => {
    let nextSib = ref?.current.nextSibling;
    while (nextSib) {
      nextSib.style.left = 0;
      nextSib = nextSib.nextSibling;
    }
  };

  return (
    <div className={classes} ref={ref} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ marginRight: `-${marginRight}rem` }}>
      <button className={cn([styles.imageContainer], { [styles.active]: active })} type="button" onClick={() => handleCardClick(card)}>
        <h2 className={titleClasses}>{t(`titles.${cardsFeature}.${description}`)}</h2>
        {type === 'warrior' && (
        <>
          <h3 className={cn([styles.warriorPower], { [styles.active]: active })}>{atkPower}</h3>
          <h3 className={cn([styles.warriorDefPow], { [styles.active]: active })}>{defPower}</h3>
          <img src={WarShield} className={cn([styles.shieldIcon], { [styles.active]: active })} alt="shield icon fow health" />
          <img src={CostIcon} className={cn([styles.costIcon], { [styles.active]: active })} alt="card cost" />
          <h3 className={cn([styles.warriorHealth], { [styles.active]: active })}>{currentHP}</h3>
        </>
        )}
        {type !== 'hero' && name !== 'fake' && (
          <h3 className={cn([styles.warriorCost], { [styles.active]: active })}>{currentC}</h3>
        )}
        {type === 'hero' && (
          <h3 className={cn([styles.heroHealth], { [styles.active]: active })}>{currentHP}</h3>
        )}
        {curCharges && showCharges
          ? (<h3 className={cn([styles.cardCharges], { [styles.active]: active })}>{curCharges}</h3>) : null}
        <img className={styles.mainImage} src={img} alt={name} />
        <ul className={styles.tokensBlock}>
          {warTokens && !bigCard && (
            warTokens.map((token) => (
              <div key={token.name} className={styles.tokenInfo}>
                {token.qty > 1 && (
                <p className={styles.showQty}>{token.qty }</p>
                )}
                <img
                  className={tokenIcon}
                  src={icons[token.name]}
                  alt="shield icon"
                />
              </div>
            ))

          )}
        </ul>
      </button>
      <button className={styles.description} onClick={() => handleCardInfoClick(card, active)} type="button" aria-label="cardinfo">
        <p className={descriptClasses}>{t(`description.${cardsFeature}.${description}`)}</p>
      </button>
    </div>
  );
});

Card.displayName = 'Card';
export default Card;
