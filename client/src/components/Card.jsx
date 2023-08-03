/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';

const Card = ({
  card, active, activeCard, content,
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
  } = card;
  const { getActiveCard } = useContext(functionContext);

  const marginRight = active !== 'active' ? content.length * 0.5 : 0; /*  empirical number */

  const classes = cn({
    'card-hand': true,
    'active-card-block__active-card': active === 'active',
  });

  const handleClick = () => {
    const activeId = getActiveCard() ? activeCard.id : null;
    if (activeId !== id) {
      dispatch(battleActions.addActiveCard({ card, player }));
    } else {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
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
      <div className="card-image-container">
        {type === 'warrior' && (
        <>
          <h3 className="warrior-power">{power}</h3>
          <h3 className="warrior-health">{health}</h3>
        </>
        )}
        {type === 'hero' && (
          <h3 className="hero-health">{health}</h3>
        )}
        <img className="card-image" src={img} alt={name} />
      </div>
      <div className="card-hand-description">
        <p>{description}</p>
      </div>
    </button>
  );
};

export default Card;
