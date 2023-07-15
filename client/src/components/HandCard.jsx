/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
import React, { useRef } from 'react';
// import cn from 'classnames';
import { useDispatch } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';

const HandCard = ({ card, activeCard }) => {
  const dispatch = useDispatch();
  const cardElement = useRef();
  const marginRight = 6 * 0.5; /*  empirical number */
  const {
    type,
    power,
    health,
    description,
    img,
    name,
    id,
  } = card;

  const classes = cn({
    'card-hand': true,
  });

  const handleClick = () => {
    const activeId = activeCard ? activeCard.id : null;
    if (activeId !== id) {
      dispatch(battleActions.addActiveCard(card));
    } else {
      dispatch(battleActions.deleteActiveCard(card));
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
        <img className="card-image" src={img} alt={name} />
      </div>
      <div className="card-hand-description">
        <p>{description}</p>
      </div>
    </button>
  );
};

export default HandCard;
