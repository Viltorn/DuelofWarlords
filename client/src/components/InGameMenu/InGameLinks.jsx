import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import functionContext from '../../contexts/functionsContext.js';
import styles from './InGameLinks.module.css';

const InGameLinks = ({ text, dest, setOpenMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { changeTutorStep } = useContext(functionContext);
  const { gameMode } = useSelector((state) => state.gameReducer);

  const handleClick = () => {
    setOpenMenu((prev) => !prev);
    if (dest === 'reset') {
      dispatch(battleActions.resetState());
      changeTutorStep(0);
      const type = gameMode === 'hotseat' ? 'openHotSeatMenu' : 'tutorial';
      dispatch(modalsActions.openModal({ type }));
    } else {
      navigate(dest);
    }
  };

  return (
    <button className={styles.button} type="button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default InGameLinks;
