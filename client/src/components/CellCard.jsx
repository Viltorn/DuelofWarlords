import React, { useRef } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';

const CellCard = ({ item, deleteFunc }) => {
  const cardElement = useRef();
  const store = useStore();
  const dispatch = useDispatch();
  const { cellId } = item;

  const marginTop = 4.5;

  const handleCardClick = () => {
    const { activeCard } = store.getState().battleReducer;
    if (!activeCard) {
      const player = cardElement.current.data;
      const cardId = cardElement.current.id;
      const { fieldCells } = store.getState().battleReducer;
      const currentCell = fieldCells.find((cell) => cell.id === cellId);
      const currentCardData = currentCell.content.find((card) => card.id === cardId);
      dispatch(battleActions.addActiveCard({ card: currentCardData, player }));
      return;
    }
    if (activeCard) {
      const cardId = cardElement.current.id;
      const activeId = activeCard.id;
      if (activeId === cardId) {
        dispatch(battleActions.deleteActiveCard(activeCard));
      } else if (activeCard.type === 'spell') {
        deleteFunc(activeCard);
        dispatch(battleActions.addFieldContent({ activeCard, id: cellId }));
        dispatch(battleActions.deleteActiveCard(activeCard));
      }
    }
  };

  return (
    <button
      ref={cardElement}
      id={item.id}
      onClick={handleCardClick}
      key={item.id}
      type="button"
      data={item.player}
      className="cell-container__content-item"
      style={{ marginTop: `-${marginTop}rem` }}
    >
      {item.type === 'warrior' && (
      <>
        <h3 className="cell-container__warrior-power">{item.power}</h3>
        <h3 className="cell-container__warrior-health">{item.health}</h3>
      </>
      )}
      <img
        className="cell-container__image"
        src={item.img}
        alt={item.name}
      />
    </button>
  );
};

export default CellCard;
