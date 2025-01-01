// import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as uiActions } from '../slices/uiSlice.js';

const useUIActions = () => {
  const {
    isTimerOver, isTimerPaused, timer, curTime,
  } = useSelector((state) => state.uiReducer);
  const dispatch = useDispatch();
  // const [[m, s], setTimer] = useState([timer ?? 0, 0]);
  // const curTime = [m, s];
  const [m, s] = curTime;

  const resetTimer = () => {
    // setTimer([parseInt(timer, 10), parseInt(0, 10)]);
    dispatch(uiActions.setCurTime([parseInt(timer, 10), parseInt(0, 10)]));
  };

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

  return {
    tick, resetTimer, curTime,
  };
};

export default useUIActions;
