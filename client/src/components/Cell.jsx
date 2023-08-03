import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';
import functionContext from '../contexts/functionsContext.js';

const Cell = ({ props, id }) => {
  const { t } = useTranslation();
  const { thisPlayer } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();
  const { type, content } = props;
  const { deleteCardfromSource, getActiveCard } = useContext(functionContext);

  const classes = cn({
    'default-cell-size': true,
    'cell-spell': type === 'midSpell' || 'topSpell',
    'cell-big-spell': type === 'bigSpell',
    'cell-field': type === 'field',
  });

  const handleCellClick = () => {
    const activeCard = getActiveCard();
    if (activeCard && activeCard.type === 'warrior' && type === 'field' && content.length === 0) {
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    } else if (activeCard && activeCard.type === 'spell' && content.length === 0) {
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
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
            <h3 className="default-cell-font ">{t(`${type}`)}</h3>
          </button>
      )}
    </div>
  );
};

export default Cell;
