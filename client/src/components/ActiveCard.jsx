import React from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import ActionButton from './ActionButton';
import Card from './Card';

const ActiveCard = ({ activeCard, playerType }) => {
  const {
    status, type,
  } = activeCard;

  const cardClasses = cn({
    'active-card-block-1': playerType === 'player1',
    'active-card-block-2': playerType === 'player2',
  });
  const { isOpened } = useSelector((state) => state.modalsReducer);

  return (
    <div className={cardClasses}>
      {!isOpened && (
        <div className="active-card__buttons">
          {(status === 'field') && (type === 'warrior' || type === 'hero') && (
          <>
            <ActionButton card={activeCard} type="turnLeft" />
            <ActionButton card={activeCard} type="turnRight" />
          </>
          )}
          {(status === 'field') && (type === 'warrior' || type === 'hero') && (
          <ActionButton card={activeCard} type="healthBar" />
          )}
          {status === 'field' && (type !== 'hero') && (
          <ActionButton card={activeCard} type="return" />
          )}
          {type !== 'hero' && (
          <ActionButton card={activeCard} type="graveyard" />
          )}
        </div>
      )}
      <Card card={activeCard} activeCard={activeCard} active="active" />
    </div>
  );
};

export default ActiveCard;