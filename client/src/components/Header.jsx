import React from 'react';
import { useTranslation } from 'react-i18next';
import PrimaryButton from './PrimaryButton';

const Header = () => {
  const { t } = useTranslation();

  return (
    <div className="header">
      <div>
        <h2>
          {t('Player')}
          1:
        </h2>
        <h2>
          {' '}
          Viktor
        </h2>
      </div>
      <div className="counter">
        <h2>1</h2>
      </div>
      <PrimaryButton
        showIcon={false}
        state="default"
        text="ПОДРОБНЕЕ"
        type="primary"
      />
      <div>
        <h2>
          {t('Player')}
          2
        </h2>
        <h2>
          {' '}
          AI
        </h2>
      </div>
      <div className="counter">
        <h2>1</h2>
      </div>
    </div>
  );
};

export default Header;
