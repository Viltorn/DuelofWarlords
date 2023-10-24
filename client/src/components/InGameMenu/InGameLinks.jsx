import React, { useContext } from 'react';
import { useDispatch } from 'react-redux';
import functionContext from '../../contexts/functionsContext.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import styles from './InGameLinks.module.css';

const InGameLinks = ({
  text, dest,
}) => {
  const dispatch = useDispatch();
  const { setOpenMenu } = useContext(functionContext);

  const handleClick = () => {
    dispatch(modalsActions.openModal({ type: 'warningWindow', dest }));
    setOpenMenu((prev) => !prev);
  };

  return (
    <button className={styles.button} type="button" onClick={handleClick}>
      {text}
    </button>
  );
};

export default InGameLinks;
