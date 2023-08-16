import React from 'react';
import { useTranslation } from 'react-i18next';
import RotateScreenImg from '../assets/battlefield/RotateScreen.png';
import './RotateScreen.css';

const RotateScreen = () => {
  const { t } = useTranslation();
  return (
    <div className="rotate-screen">
      <h2>{t('RotateScreen')}</h2>
      <img className="rotate-screen__img" src={RotateScreenImg} alt="rotate screen" />
    </div>
  );
};

export default RotateScreen;
