import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { actions as modalsActions } from '../../../slices/modalsSlice.js';
// import functionContext from '../../contexts/functionsContext.js';
import { actions as gameActions } from '../../../slices/gameSlice.js';
import styles from './MenuBtn.module.css';

const MenuBtn = ({
  text, type, data,
}) => {
  const option = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const askForInstall = async () => {
    console.log('👍', 'butInstall-clicked');
    const promptEvent = window.deferredPrompt;
    if (!promptEvent) {
      // The deferred prompt isn't available.
      return;
    }
    // Show the install prompt.
    promptEvent.prompt();
    // Log the result
    const result = await promptEvent.userChoice;
    console.log('👍', 'userChoice', result);
    // Reset the deferred prompt variable, since
    // prompt() can only be called once.
    window.deferredPrompt = null;
    // Hide the install button.
  };

  const handleOptionClick = () => {
    const gameMode = option.current.dataset.type;
    dispatch(modalsActions.closeModal());
    if (gameMode === 'online') {
      dispatch(gameActions.setGameMode({ gameMode }));
      navigate('/lobby');
    } else if (gameMode === 'build') {
      dispatch(gameActions.setGameMode({ gameMode }));
      navigate('/choosedeck');
    } else if (gameMode === 'hotseat') {
      navigate('/battle');
      dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
    } else if (gameMode === 'tutorial') {
      navigate('/battle');
      dispatch(modalsActions.openModal({ type: 'tutorial' }));
      dispatch(gameActions.setGameMode({ gameMode }));
    }
  };

  return (
    <button
      ref={option}
      data-type={data}
      className={cn(styles.btn, { [styles.primary]: type === 'primary', [styles.secondary]: type === 'secondary' })}
      type="button"
      onClick={() => (data === 'install' ? askForInstall() : handleOptionClick())}
    >
      {text}
    </button>
  );
};

export default MenuBtn;
