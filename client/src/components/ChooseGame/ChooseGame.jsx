import React from 'react';
import { useTranslation } from 'react-i18next';

import MenuBtn from './MenuBtn';
import './ChooseGame.css';

const ChooseGame = () => {
  const { t } = useTranslation();

  return (
    <div className="choose-game">
      <div className="choose-game__options">
        <MenuBtn text={t('Install')} data="install" type="secondary" />
        <hr className="choose-gamehr__hr" />
        <h2 className="choose-game__header">{t('ChooseGame')}</h2>
        <MenuBtn text={t('Tutorial')} data="tutorial" type="primary" />
        <MenuBtn text={t('HotSeat')} data="hotseat" type="primary" />
      </div>
    </div>
  );
};

export default ChooseGame;
