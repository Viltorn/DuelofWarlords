import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';
import './Cell.css';
import functionContext from '../contexts/functionsContext.js';

const Cell = ({ props, id }) => {
  const { t } = useTranslation();
  const { thisPlayer, playerPoints, fieldCells } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();
  const { type, content } = props;
  const { deleteCardfromSource, getActiveCard } = useContext(functionContext);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;

  const classes = cn({
    'cell__default-size': true,
    cell__spell: type === 'midSpell' || 'topSpell',
    'cell__big-spell': type === 'bigSpell',
    cell__field: type === 'field',
  });

  const isAllowedCost = (card) => {
    const newCost = currentPoints - card.cost;
    if ((card.status === 'hand' && newCost >= 0) || card.status !== 'hand') {
      return true;
    }
    return false;
  };

  const moveAttachedSpells = (card) => {
    if (card.type === 'warrior' && card.status === 'field') {
      const { cellId } = card;
      const activeCell = fieldCells.find((cell) => cell.id === cellId);
      activeCell.content.forEach((item) => {
        if (item.type === 'spell') {
          dispatch(battleActions.addFieldContent({ activeCard: item, id }));
          deleteCardfromSource(item);
        }
      });
    }
  };

  const handleCellClick = () => {
    const activeCard = getActiveCard();

    const addCardToField = () => {
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.cost;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      moveAttachedSpells(activeCard);
    };

    if (activeCard && !isAllowedCost(activeCard)) {
      return;
    }

    if ((activeCard && activeCard.type === 'warrior' && type === 'field' && content.length === 0)
    || (activeCard && activeCard.type === 'spell')) {
      addCardToField();
    }
  };

  return (
    <div className={classes}>
      {content.length !== 0 ? (
        content.map((item) => (
          <CellCard
            key={item.id}
            item={item}
            type={type}
            content={content}
          />
        ))) : (
          <button type="button" className="cell__default-btn" onClick={handleCellClick}>
            <h3 className="cell__title-default">{t(`${type}`)}</h3>
          </button>
      )}
    </div>
  );
};

export default Cell;
