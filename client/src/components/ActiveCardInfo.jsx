import React from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './ActiveCardInfo.module.css';

const ActiveCardInfo = ({ info, player }) => {
  const { t } = useTranslation();

  const infoClass = cn({
    [styles.infoWindow]: true,
    [styles.marginRight]: player === 'player1',
    [styles.marginLeft]: player === 'player2',
  });

  return (
    <div className={infoClass}>
      {info.map((item) => (
        <div key={item}>
          <h3 className={styles.tipTitle}>{t(`menuTipsHeader.${item}`)}</h3>
          <span className={styles.tipBody}>{t(`menuTipsDescription.${item}`)}</span>
        </div>
      ))}
    </div>
  );
};

export default ActiveCardInfo;
