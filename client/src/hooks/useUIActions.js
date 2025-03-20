// import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions as uiActions } from '../slices/uiSlice.js';

const useUIActions = () => {
  const {
    timer,
  } = useSelector((state) => state.uiReducer);
  const dispatch = useDispatch();
  // const curTime = [m, s];
  // const [m, s] = curTime;

  const resetTimer = () => {
    // setTimer([parseInt(timer, 10), parseInt(0, 10)]);
    dispatch(uiActions.setCurTime([parseInt(timer, 10), parseInt(0, 10)]));
  };

  return {
    resetTimer,
  };
};

export default useUIActions;
