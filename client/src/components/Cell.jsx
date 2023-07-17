import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';

const Cell = ({ props, id }) => {
  const { t } = useTranslation();
  const store = useStore();
  const dispatch = useDispatch();
  const {
    content,
    type,
    status,
  } = props;

  const classes = cn({
    'default-cell-size': true,
    'cell-spell': type === 'midSpell' || 'topSpell',
    'cell-big-spell': type === 'bigSpell',
    'cell-field': type === 'field',
    inactive: status === 'inactive',
  });

  const marginTop = content.length * 0.5;

  const handleCellClick = () => {
    const { activeCard } = store.getState().battleReducer;
    console.log(activeCard);
    if (activeCard) {
      if (activeCard.type === 'warrior' && content.length === 0) {
        dispatch(battleActions.addFieldContent({ activeCard, id }));
      }
    }
  };

  return (
    <button type="button" onClick={handleCellClick} className={classes}>
      {content.length !== 0 && (
        content.map((item) => (
          <div key={item.id} className="cell-container__content" style={{ marginTop: `-${marginTop}rem` }}>
            {item.type === 'warrior' && (
            <>
              <h3 className="cell-container__warrior-power">{item.power}</h3>
              <h3 className="cell-container__warrior-health">{item.health}</h3>
            </>
            )}
            <img className="cell-container__image" src={item.img} alt={item.name} />
          </div>
        ))
      )}
      {type !== 'field' && (
        <h3 className="default-cell-font ">{t(`${type}`)}</h3>
      )}
    </button>
  );
};

export default Cell;
