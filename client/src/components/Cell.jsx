import React from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

const Cell = ({ props }) => {
  const { t } = useTranslation();
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

  return (
    <div className={classes}>
      {content.length !== 0 ? (
        content.map((item) => (
          <img className="fieldcell-image" key={item.id} src={item.img} alt={item.name} />
        ))
      ) : <h3 className="default-cell-font ">{t(`${type}`)}</h3>}
    </div>
  );
};

export default Cell;
