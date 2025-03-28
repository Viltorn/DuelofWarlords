import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DiscordLogo from '@assets/discord.svg';
import TelgramLogo from '@assets/telegram.png';
import InGameLinks from './InGameLinks.jsx';
import functionContext from '../../../contexts/functionsContext.js';
import styles from './InGameMenu.module.css';

const InGameMenu = () => {
  const { gameMode } = useSelector((state) => state.gameReducer);
  const { isOpenMenu } = useContext(functionContext);
  const { t } = useTranslation();
  return (
    <div className={styles.container} style={{ transform: `${isOpenMenu ? 'translateY(0)' : 'translateY(-35rem)'}` }}>
      <ul className={styles.menubar}>
        <div className={styles.menuItems}>
          <li className={styles.menuItem}>
            <InGameLinks text={t('buttons.MAIN')} dest="/" />
          </li>
          <li className={styles.menuItem}>
            <InGameLinks text={t('buttons.GAMECHOOSE')} dest="/choose" />
          </li>
          {gameMode !== 'online' ? (
            <li className={styles.menuItem}>
              <InGameLinks text={t('buttons.RESETGAME')} dest="reset" />
            </li>
          ) : (
            <li className={styles.menuItem}>
              <InGameLinks text={t('buttons.GOLOBBY')} dest="/lobby" />
            </li>
          )}
        </div>
      </ul>
      <li className={styles.contactBlock}>
        <p className={styles.footFeedback}>{t('Contact')}</p>
        <a href="https://discord.gg/FAy4BhxNyD" target="_blank" rel="noreferrer"><img className={styles.discord} src={DiscordLogo} alt="discord logo" /></a>
        <a href="https://t.me/+aKetsu0adqI1OWMy" target="_blank" rel="noreferrer"><img className={styles.discord} src={TelgramLogo} alt="telegram link" /></a>
      </li>
    </div>
  );
};

export default InGameMenu;
