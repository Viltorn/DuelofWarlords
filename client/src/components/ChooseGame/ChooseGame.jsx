import React from 'react';
import { useTranslation } from 'react-i18next';

import MenuBtn from './MenuBtn';
import './ChooseGame.css';

const ChooseGame = () => {
  const { t } = useTranslation();

  const handleInstallClick = async () => {
    console.log('👍', 'butInstall-clicked');
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log('👍', 'userChoice', result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
  };

  return (
    <div className="choose-game">
      <div className="choose-game__options">
        <MenuBtn text={t('Install')} type="secondary" handleClick={handleInstallClick} />
        <hr className="choose-gamehr__hr" />
        <h2 className="choose-game__header">{t('ChooseGame')}</h2>
        <MenuBtn text={t('Tutorial')} data="tutorial" type="primary" />
        <MenuBtn text={t('HotSeat')} data="hotseat" type="primary" />
      </div>
    </div>
  );
};

export default ChooseGame;
