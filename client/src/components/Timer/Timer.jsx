/* eslint-disable react-hooks/exhaustive-deps */
import {
  useEffect, useRef, useCallback,
} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { actions as uiActions } from '../../slices/uiSlice.js';
import useUIActions from '../../hooks/useUIActions';
import styles from './Timer.module.css';
import useClickActions from '../../hooks/useClickActions';

const Timer = ({ thisPlayer }) => {
  const { hadleEndTurnClick } = useClickActions();
  const {
    isTimerOver, isTimerPaused, curTime,
  } = useSelector((state) => state.uiReducer);
  const { resetTimer } = useUIActions();
  const timerRef = useRef(null);
  const [m, s] = curTime ?? [0, 0];
  const dispatch = useDispatch();

  const tick = () => {
    if (isTimerOver || isTimerPaused) return;
    if (m === 0 && s === 0) {
      dispatch(uiActions.setTimerIsOver(true));
      resetTimer();
    } else if (s === 0) {
      dispatch(uiActions.setCurTime([m - 1, 59]));
      // setTimer([m - 1, 59]);
    } else {
      dispatch(uiActions.setCurTime([m, s - 1]));
      // setTimer([m, s - 1]);
    }
  };

  const startTimer = useCallback(() => {
    if (timerRef.current) return; // Prevent multiple intervals

    timerRef.current = setInterval(() => tick(), 1000);
  }, [timerRef, tick]);

  const stopTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = null;
  };

  useEffect(() => {
    if (isTimerOver) {
      hadleEndTurnClick();
    }
  }, [isTimerOver, hadleEndTurnClick]);

  useEffect(() => {
    startTimer();
    return () => stopTimer();
  }, [startTimer]);

  const containerClasses = cn({
    [styles.container]: true,
    [styles.alignLeft]: thisPlayer === 'player2',
  });

  const timeClasses = cn({
    [styles.timer]: true,
    [styles.normalColor]: m > 0 || s > 30,
    [styles.redColor]: m === 0 && s <= 30,
  });

  return (
    <div className={containerClasses}>
      <p className={timeClasses}>
        {`${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`}
      </p>
    </div>
  );
};

export default Timer;
