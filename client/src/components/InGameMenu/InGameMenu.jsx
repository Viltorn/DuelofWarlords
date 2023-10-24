import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import InGameLinks from './InGameLinks.jsx';
import tipsData from '../../gameData/tipsData.js';
import functionContext from '../../contexts/functionsContext.js';
import Tip from './Tip.jsx';
import styles from './InGameMenu.module.css';

const InGameMenu = () => {
  const { gameMode } = useSelector((state) => state.gameReducer);
  const { isOpenMenu } = useContext(functionContext);
  const { t } = useTranslation();
  return (
    <div className={styles.container} style={{ transform: `${isOpenMenu ? 'translateY(0)' : 'translateY(-35rem)'}` }}>
      <ul className={styles.menubar}>
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
      </ul>
      <div className={styles.tipsBlock}>
        <h3>{t('Tips')}</h3>
        <div className={styles.tips}>
          {tipsData.map((tip) => (
            <Tip key={tip.id} h1={tip.h1} p={tip.p} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default InGameMenu;
