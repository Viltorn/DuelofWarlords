import React from 'react';
import InGameLinks from './InGameLinks.jsx';
import tipsData from '../../gameData/tipsData.js';
import Tip from './Tip.jsx';
import styles from './InGameMenu.module.css';

const InGameMenu = ({ isOpenMenu, setOpenMenu }) => (
  <div className={styles.container} style={{ transform: `${isOpenMenu ? 'translateY(0)' : 'translateY(-35rem)'}` }}>
    <ul className={styles.menubar}>
      <li className={styles.menuItem}>
        <InGameLinks text="ГЛАВНАЯ" setOpenMenu={setOpenMenu} dest="/" />
      </li>
      <li className={styles.menuItem}>
        <InGameLinks text="ВЫБОР ИГРЫ" setOpenMenu={setOpenMenu} dest="/choose" />
      </li>
      <li className={styles.menuItem}>
        <InGameLinks text="СБРОСИТЬ ПРОГРЕСС" setOpenMenu={setOpenMenu} dest="reset" />
      </li>
    </ul>
    <div className={styles.tipsBlock}>
      <h3>ПОДСКАЗКИ</h3>
      <div className={styles.tips}>
        {tipsData.map((tip) => (
          <Tip key={tip.id} h1={tip.h1} p={tip.p} />
        ))}
      </div>
    </div>
  </div>
);

export default InGameMenu;
