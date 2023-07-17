import React from 'react';
import ActionButton from './ActionButton';
import HandCard from './Card';

const ActiveCard = ({ card, activeCard }) => {
  const { status, type, id } = card;

  return (
    <div className="active-card-block">
      <div className="active-card__buttons">
        {(status === 'field' && type === 'warrior') && (
        <>
          <ActionButton button={{ btnType: 'turnLeft', id }} />
          <ActionButton button={{ btnType: 'turnRight', id }} />
        </>
        )}
        {type === 'warrior' && (
          <ActionButton button={{ btnType: 'healthBar', id }} />
        )}
      </div>
      <HandCard card={card} activeCard={activeCard} />
    </div>
  );
};

export default ActiveCard;
