/* eslint-disable functional/no-loop-statements */
/* eslint-disable functional/no-let */
import React, { useRef } from 'react';
// import cn from 'classnames';
import CardCover from '../assets/battlefield/Card_back.png';

const HandCard = ({ card, player }) => {
  const {
    type,
    power,
    health,
    description,
    img,
    name,
  } = card;

  const cardElement = useRef();
  // const margin = 5 * 0.8;
  const marginRight = 10 * 0.4;

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
    <div className="card-hand" ref={cardElement} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} style={{ marginRight: `-${marginRight}rem` }}>
      {player === 'Player1' ? (
        <>
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
        </>
      ) : <img className="card-back" src={CardCover} alt="card cover" />}
    </div>
  );
};

export default HandCard;
