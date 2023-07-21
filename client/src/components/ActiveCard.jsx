import React from 'react';
import ActionButton from './ActionButton';
import Card from './Card';

const ActiveCard = ({ activeCard }) => {
  const {
    status, type,
  } = activeCard;

  return (
    <div className="active-card-block">
      <div className="active-card__buttons">
        {(status === 'field' && type === 'warrior') && (
        <>
          <ActionButton card={activeCard} type="turnLeft" />
          <ActionButton card={activeCard} type="turnRight" />
        </>
        )}
        {type === 'warrior' && (
          <ActionButton card={activeCard} type="healthBar" />
        )}
        {status === 'field' && (
          <ActionButton card={activeCard} type="return" />
        )}
      </div>
      <Card card={activeCard} activeCard={activeCard} active="active" />
    </div>
  );
};

export default ActiveCard;
