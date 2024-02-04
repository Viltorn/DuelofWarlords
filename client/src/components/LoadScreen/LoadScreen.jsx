/* eslint-disable */
import React from 'react';
import { useTranslation } from 'react-i18next';
import styles from './LoadScreen.module.css';

const LoadScreen = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h2>{t('Loading')}</h2>
    </div>
  );
};

export default LoadScreen;

