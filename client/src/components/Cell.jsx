import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';

const Cell = ({ props, id }) => {
  const { t } = useTranslation();
  const store = useStore();
  const dispatch = useDispatch();
  const { type, content } = props;

  const classes = cn({
    'default-cell-size': true,
    'cell-spell': type === 'midSpell' || 'topSpell',
    'cell-big-spell': type === 'bigSpell',
    'cell-field': type === 'field',
  });

  const deleteCardfromSource = (card) => {
    const { player, status, cellId } = card;
    const cardId = card.id;
    switch (status) {
      case 'hand':
        dispatch(battleActions.deleteHandCard({ cardId, player }));
        break;
      case 'field':
        dispatch(battleActions.deleteFieldCard({ cardId, cellId }));
        break;
      default:
        break;
    }
  };

  const handleCellClick = () => {
    const { activeCard } = store.getState().battleReducer;
    if (activeCard && activeCard.type === 'warrior' && type === 'field' && content.length === 0) {
      deleteCardfromSource(activeCard);
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      dispatch(battleActions.deleteActiveCard(activeCard));
      return;
    }
    if (activeCard && activeCard.type === 'spell' && (type === 'midSpell' || 'bigSpell' || 'topSpell') && content.length === 0) {
      deleteCardfromSource(activeCard);
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      dispatch(battleActions.deleteActiveCard(activeCard));
    }
  };

  return (
    <div className={classes}>
      {content.length !== 0 ? (
        content.map((item) => (
          <CellCard key={item.id} item={item} content={content} deleteFunc={deleteCardfromSource} />
        ))) : (
          <button type="button" className="cell__default-btn" onClick={handleCellClick}>
            <h3 className="default-cell-font ">{t(`${type}`)}</h3>
          </button>
      )}
    </div>
  );
};

export default Cell;
