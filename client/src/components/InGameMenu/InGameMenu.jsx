import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import tipsData from '../../gameData/tipsData.js';
import Tip from './Tip.jsx';
import styles from './InGameMenu.module.css';

const InGameMenu = ({ isOpenMenu }) => {
  const dispatch = useDispatch();
  const handleResetClick = () => {
    dispatch(battleActions.resetState());
    dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
  };
  return (
    <div className={styles.container} style={{ transform: `${isOpenMenu ? 'translateY(0)' : 'translateY(-33rem)'}` }}>
      <ul className={styles.menubar}>
        <li className={styles.menuItem}><Link to="/" className={styles.link}>ГЛАВНАЯ</Link></li>
        <li className={styles.menuItem}><Link to="/choose" className={styles.link}>ВЫБОР ИГРЫ</Link></li>
        <li className={styles.menuItem}>
          <button className={styles.resetBtn} type="button" onClick={handleResetClick}>
            СБРОСИТЬ ИГРУ
          </button>
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
};

export default InGameMenu;
