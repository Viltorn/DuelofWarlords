/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';
import './Card.css';

const Card = ({
  card, active, content,
}) => {
  const dispatch = useDispatch();
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
  } = card;
  const { getActiveCard, handleAnimation } = useContext(functionContext);

  const marginRight = active !== 'active' ? Math.min(content.length * 0.5, 5.6) : 0; /*  empirical number */

  const classes = cn({
    'card-block': true,
    'card-block_active': active === 'active',
  });

  const descriptClasses = cn({
    'card-block__font-active': active === 'active',
    'card-block__font': active !== 'active',
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
      nextSib.style.left = `${marginRight + 1}rem`;
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
      <div className={cn('card-block__image-container', { active: active === 'active' })}>
        {type === 'warrior' && (
        <>
          <h3 className={cn('card-block__warrior-power', { active: active === 'active' })}>{power}</h3>
          <h3 className={cn('card-block__warrior-health', { active: active === 'active' })}>{health}</h3>
        </>
        )}
        {type !== 'hero' && (
          <h3 className={cn('card-block__warrior-cost', { active: active === 'active' })}>{currentC}</h3>
        )}
        {type === 'hero' && (
          <h3 className="card-block__hero-health">{health}</h3>
        )}
        <img className="card-block__main-image" src={img} alt={name} />
      </div>
      <div className="card-block__description">
        <p className={descriptClasses}>{description}</p>
      </div>
    </button>
  );
};

export default Card;
