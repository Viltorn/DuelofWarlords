import React, { useState, useEffect, useRef } from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import CloseBtn from '@assets/CloseBtn.svg';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import LogItem from './LogItem.jsx';
import styles from './CombatLog.module.css';

const CombatLog = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const list = useRef();

  const { combatLog, thisPlayer } = useSelector((state) => state.battleReducer);

  const appear = { transform: 'translateX(0)' };

  const [isShowAnimation, setShowAnimation] = useState(false);

  const windowStyle = cn({
    [styles.window]: true,
    [styles.rightWindow]: thisPlayer === 'player1',
    [styles.leftWindow]: thisPlayer === 'player2',
  });

  useEffect(() => {
    setTimeout(() => setShowAnimation(true), 0);
  }, []);

  useEffect(() => {
    if (list.current) {
      list.current.scrollTop = list.current.scrollHeight;
    }
  }, [list]);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  return (
    <dialog className={windowStyle} style={isShowAnimation ? appear : {}}>
      <div className={styles.headBlock}>
        <h2 className={styles.header}>{t('CombatLog')}</h2>
        <button onClick={() => handleClose()} className={styles.closeBtn} type="button"><img src={CloseBtn} alt="close" /></button>
      </div>
      <div className={styles.actionsBlock} ref={list}>
        {combatLog.map((item) => (
          <LogItem item={item} key={item.id} />
        ))}
      </div>
    </dialog>
  );
};

export default CombatLog;
