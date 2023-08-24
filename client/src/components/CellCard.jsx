import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';
import './CellCard.css';

const getTopMargin = (cardtype) => {
  if (cardtype === 'field') {
    return 5;
  }
  if (cardtype === 'hero') {
    return 6.5;
  }
  return 0;
};

const CellCard = ({ item, type }) => {
  const { deleteCardfromSource, getActiveCard, handleAnimation } = useContext(functionContext);
  const cardElement = useRef();
  const dispatch = useDispatch();
  const { cellId, turn } = item;
  const { thisPlayer, fieldCells, playerPoints } = useSelector((state) => state.battleReducer);
  const currentCell = fieldCells.find((cell) => cell.id === cellId);
  const currentPoints = playerPoints.find((data) => data.player === thisPlayer).points;
  const marginTop = getTopMargin(type);
  const marginRight = type === 'bigSpell' ? 1.5 : 0;

  const cardStyles = cn({
    'cell-container__content-item': type !== 'hero',
    'cell-container__hero-cell-item': type === 'hero',
    turn_1: turn === 1,
    turn_2: turn === 2,
  });

  const isAllowedCost = (card) => {
    const newCost = currentPoints - card.cost;
    if ((card.status === 'hand' && newCost >= 0) || card.status !== 'hand') {
      return true;
    }
    return false;
  };

  const handleCardClick = () => {
    const activeCard = getActiveCard();
    const cardId = cardElement.current.id;
    const activeId = activeCard?.id ?? null;
    if (activeId === cardId) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
    } else if (activeCard?.type === 'spell') {
      if (!isAllowedCost(activeCard)) {
        return;
      }
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.cost;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      handleAnimation(activeCard, 'delete');
      deleteCardfromSource(activeCard);
      dispatch(battleActions.addFieldContent({ activeCard, id: cellId }));
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    } else {
      const currentCardData = currentCell.content.find((card) => card.id === cardId);
      dispatch(battleActions.addActiveCard({ card: currentCardData, player: thisPlayer }));
      handleAnimation(currentCardData, 'add');
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
      {item.type === 'hero' && (
        <h3 className="cell-container__hero-health">{item.currentHP}</h3>
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
