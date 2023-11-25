import React, { useRef, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';
import styles from './Card.module.css';

const Card = ({
  card, active, content,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { thisPlayer } = useSelector((state) => state.battleReducer);
  const cardElement = useRef();
  const {
    type,
    power,
    health,
    description,
    img,
    name,
    id,
    player,
    currentC,
    faction,
  } = card;
  const { getActiveCard, handleAnimation } = useContext(functionContext);

  const marginRight = active ? 0 : Math.min(content.length * 0.5, 5.6); /*  empirical number */

  const classes = cn({
    [styles.cardBlock]: true,
    [styles.cardBlock_active]: active,
  });

  const descriptClasses = cn({
    [styles.fontActive]: active,
    [styles.font]: !active,
  });

  const titleClasses = cn({
    [styles.cardName]: type !== 'hero',
    [styles.cardNameActive]: type !== 'hero' && active,
    [styles.heroNameActive]: type === 'hero' && active,
  });

  const handleClick = () => {
    const activeCard = getActiveCard();
    const activeId = activeCard ? activeCard.id : null;
    if (activeId !== id) {
      handleAnimation(activeCard, 'delete');
      dispatch(battleActions.addActiveCard({ card, player }));
      handleAnimation(card, 'add');
    } else {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
    }
  };

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
    <button className={classes} type="button" ref={cardElement} onClick={handleClick} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ marginRight: `-${marginRight}rem` }}>
      <div className={cn([styles.imageContainer], { [styles.active]: active })}>
        <h2 className={titleClasses}>{t(`titles.${faction}.${description}`)}</h2>
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
      </div>
      <div className={styles.description}>
        <p className={descriptClasses}>{t(`description.${faction}.${description}`)}</p>
      </div>
    </button>
  );
};

export default Card;
