import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import InGameLinks from './InGameLinks.jsx';
import tipsData from '../../gameData/tipsData.js';
import functionContext from '../../contexts/functionsContext.js';
import DiscordLogo from '../../assets/battlefield/discordBlack.svg';
import Tip from './Tip.jsx';
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
            <InGameLinks text={t('MAIN')} dest="/" />
          </li>
          <li className={styles.menuItem}>
            <InGameLinks text={t('GAMECHOOSE')} dest="/choose" />
          </li>
          {gameMode !== 'online' ? (
            <li className={styles.menuItem}>
              <InGameLinks text={t('RESETGAME')} dest="reset" />
            </li>
          ) : (
            <li className={styles.menuItem}>
              <InGameLinks text={t('GOLOBBY')} dest="/lobby" />
            </li>
          )}
        </div>
        <li className={styles.contactBlock}>
          <p className={styles.footFeedback}>{t('Contact')}</p>
          <a href="https://discord.gg/BUTqPcRC" target="_blank" rel="noreferrer"><img className={styles.discord} src={DiscordLogo} alt="discord logo" /></a>
        </li>
      </ul>
      <div className={styles.tipsBlock}>
        <h3>{t('Tips')}</h3>
        <div className={styles.tips}>
          {tipsData.map((tip) => (
            <Tip key={tip.id} h1={t(`menuTipsHeader.${tip.h1}`)} p={t(`menuTipsDescription.${tip.h1}`)} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InGameMenu;
