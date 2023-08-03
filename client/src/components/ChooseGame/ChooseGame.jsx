import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import PrimaryButton from '../PrimaryButton';
import './ChooseGame.css';

const ChooseGame = () => {
  const { t } = useTranslation();

  return (
    <div className="choose-game">
      <div className="choose-game__options">
        <h2 className="choose-game__header">{t('ChooseGame')}</h2>
        <Link to="/tutorial" className="link">
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('Tutorial')}
            variant="primary"
            type="submit"
          />
        </Link>
        <Link to="/hotseatmenu" className="link">
          <PrimaryButton
            showIcon={false}
            state="default"
            text={t('HotSeat')}
            variant="primary"
            type="submit"
            disabled
          />
        </Link>
      </div>
    </div>
  );
};

export default ChooseGame;
