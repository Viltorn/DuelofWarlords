import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './DeckBuilderWindow.module.css';

const DeckBuilderWindow = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h2>{t('DeckBuilder')}</h2>
    </div>
  );
};

export default DeckBuilderWindow;
