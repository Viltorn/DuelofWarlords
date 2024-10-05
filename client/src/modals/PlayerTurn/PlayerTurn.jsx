import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './PlayerTurn.module.css';

const PlayerTurn = () => {
  const { t } = useTranslation();

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <div className={styles.mainBlock}>
          <h2 className={styles.title}>{t('YourTurn')}</h2>
        </div>
      </div>
    </dialog>
  );
};

export default PlayerTurn;
