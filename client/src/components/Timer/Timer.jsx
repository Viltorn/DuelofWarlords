/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from 'react';
import cn from 'classnames';
import { useSelector } from 'react-redux';
import useUIActions from '../../hooks/useUIActions';
import styles from './Timer.module.css';
import useClickActions from '../../hooks/useClickActions';

const Timer = () => {
  const {
    tick,
  } = useUIActions();
  const { hadleEndTurnClick } = useClickActions();
  const { isTimerOver, curTime } = useSelector((state) => state.uiReducer);
  const [m, s] = curTime ?? [0, 0];

  useEffect(() => {
    if (isTimerOver) {
      console.log('end turn');
      hadleEndTurnClick();
    }
  }, [isTimerOver, hadleEndTurnClick]);

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  }, [tick]);

  const containerClasses = cn({
    [styles.container]: true,
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
