import { useState } from 'react';
import { useSelector } from 'react-redux';

const useUIActions = () => {
  const { turnTimer } = useSelector((state) => state.battleReducer);
  const [timerIsPaused, setTimerPaused] = useState(false);
  const [timerIsOver, setTimerOver] = useState(false);
  const [[m, s], setTimer] = useState([turnTimer ?? 0, 0]);
  const curTimer = [m, s];

  const resetTimer = () => {
    setTimer([parseInt(turnTimer, 10), parseInt(0, 10)]);
  };

  const tick = () => {
    if (timerIsOver || timerIsPaused) return;

    if (m === 0 && s === 0) {
      setTimerOver(true);
      resetTimer();
    } else if (s === 0) {
      setTimer([m - 1, 59]);
    } else {
      setTimer([m, s - 1]);
    }
  };

  return {
    tick, resetTimer, curTimer, timerIsOver, setTimerPaused, setTimerOver,
  };
};

export default useUIActions;
