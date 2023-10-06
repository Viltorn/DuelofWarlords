import React from 'react';
import { useTranslation } from 'react-i18next';
import RotateScreenImg from '../assets/battlefield/RotateScreen.png';
import styles from './RotateScreen.module.css';

const RotateScreen = () => {
  const { t } = useTranslation();
  return (
    <div className={styles.container}>
      <h2>{t('RotateScreen')}</h2>
      <img className={styles.img} src={RotateScreenImg} alt="rotate screen" />
    </div>
  );
};

export default RotateScreen;
