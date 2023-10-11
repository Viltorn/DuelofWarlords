import React from 'react';
import { useTranslation } from 'react-i18next';
import gameVersion from '../../gameData/currentGameVer';

import MenuBtn from './MenuBtn';
import styles from './ChooseGame.module.css';

const ChooseGame = () => {
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <p className={styles.version}>{gameVersion}</p>
      <div className={styles.options}>
        <MenuBtn text={t('Install')} data="install" type="secondary" />
        <hr className={styles.divider} />
        <h2 className={styles.header}>{t('ChooseGame')}</h2>
        <MenuBtn text={t('Tutorial')} data="tutorial" type="primary" />
        <MenuBtn text={t('HotSeat')} data="hotseat" type="primary" />
      </div>
    </div>
  );
};

export default ChooseGame;
