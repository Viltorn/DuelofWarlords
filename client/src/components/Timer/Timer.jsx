import { useEffect } from 'react';
import cn from 'classnames';
import useUIActions from '../../hooks/useUIActions';
import styles from './Timer.module.css';
import useClickActions from '../../hooks/useClickActions';

const CountDown = () => {
  const { tick, curTimer, timerIsOver } = useUIActions();
  const { hadleEndTurnClick } = useClickActions();
  const [m, s] = curTimer ?? [0, 0];
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return () => clearInterval(timerID);
  });

  useEffect(() => {
    if (timerIsOver) {
      console.log('end turn');
      hadleEndTurnClick();
    }
  }, [timerIsOver, hadleEndTurnClick]);

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

export default CountDown;
