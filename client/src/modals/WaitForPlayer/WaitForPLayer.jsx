import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './WaitForPlayer.module.css';

const WaitForPlayer = () => {
  const { t } = useTranslation();
  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('WaitForPLayer')}</h2>
      </div>
    </dialog>
  );
};

export default WaitForPlayer;
