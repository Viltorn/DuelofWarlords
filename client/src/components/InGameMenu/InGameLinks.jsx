import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import styles from './InGameLinks.module.css';

const InGameLinks = ({ text, dest, setOpenMenu }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleClick = () => {
    dispatch(battleActions.resetState());
    dispatch(battleActions.changePlayer({ newPlayer: 'player1' }));
    setOpenMenu((prev) => !prev);
    if (dest === 'reset') {
      dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
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
