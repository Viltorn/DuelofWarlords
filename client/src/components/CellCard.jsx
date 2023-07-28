import React, { useRef, useContext } from 'react';
import { useDispatch, useStore } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';

const CellCard = ({ item, type }) => {
  const { deleteCardfromSource } = useContext(functionContext);
  const cardElement = useRef();
  const store = useStore();
  const dispatch = useDispatch();
  const { cellId, turn } = item;

  const marginTop = type === 'field' ? 4.5 : 0;
  const marginRight = type === 'bigSpell' ? 1.5 : 0;

  const cardStyles = cn({
    'cell-container__content-item': true,
    turn_1: turn === 1,
    turn_2: turn === 2,
  });

  const handleCardClick = () => {
    const { activeCardPlayer1, activeCardPlayer2, thisPlayer } = store.getState().battleReducer;
    const activeCard = thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
    if (!activeCard) {
      const cardId = cardElement.current.id;
      const { fieldCells } = store.getState().battleReducer;
      const currentCell = fieldCells.find((cell) => cell.id === cellId);
      const currentCardData = currentCell.content.find((card) => card.id === cardId);
      dispatch(battleActions.addActiveCard({ card: currentCardData, player: thisPlayer }));
    } else {
      const cardId = cardElement.current.id;
      const activeId = activeCard.id;
      if (activeId === cardId) {
        dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      } else if (activeCard.type === 'spell') {
        deleteCardfromSource(activeCard);
        dispatch(battleActions.addFieldContent({ activeCard, id: cellId }));
        dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
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
      className={cardStyles}
      style={{ marginTop: `-${marginTop}rem`, marginRight: `-${marginRight}rem` }}
    >
      {item.type === 'warrior' && (
      <>
        <h3 className="cell-container__warrior-power">{item.power}</h3>
        <h3 className="cell-container__warrior-health">{item.currentHP}</h3>
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
