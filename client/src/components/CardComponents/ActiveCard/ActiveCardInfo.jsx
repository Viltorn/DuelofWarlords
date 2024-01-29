import React from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './ActiveCardInfo.module.css';

const ActiveCardInfo = ({ info, type }) => {
  const { t } = useTranslation();

  const infoClass = cn({
    [styles.infoWindow]: true,
    [styles.marginRight]: type === 'player1',
    [styles.marginLeft]: type === 'player2',
    [styles.buildType]: type === 'build',
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
