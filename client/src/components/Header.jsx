import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './PrimaryButton';

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="header">
      <div className="players-info">
        <h3 className="title-main-font">
          {t('Player')}
          1:
        </h3>
        <h3 className="title-main-font">
          {' '}
          Viktor
        </h3>
      </div>
      <div className="counter">
        <h3 className="counter-number">1</h3>
      </div>
      <PrimaryButton
        showIcon={false}
        state="default"
        text="ЗАКОНЧИТЬ ХОД"
        type="primary"
      />
      <div className="counter">
        <h3 className="counter-number">1</h3>
      </div>
      <div className="players-info">
        <h3 className="title-main-font">
          {t('Player')}
          2:
        </h3>
        <h3 className="title-main-font">
          {' '}
          AI
        </h3>
      </div>
    </div>
  );
};

export default Header;
