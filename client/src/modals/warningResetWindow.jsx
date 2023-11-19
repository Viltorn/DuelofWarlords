import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import functionContext from '../contexts/functionsContext.js';
import PrimaryButton from '../components/PrimaryButton';
import styles from './warningResetWindow.module.css';
import socket from '../socket';

const WarningResetWindow = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dest } = useSelector((state) => state.modalsReducer);
  const { gameMode, curRoom, name } = useSelector((state) => state.gameReducer);
  const { changeTutorStep } = useContext(functionContext);

  const handleClick = () => {
    dispatch(battleActions.resetState());
    changeTutorStep(0);
    if (dest === 'reset' && gameMode === 'hotseat') {
      dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
      return;
    }
    if (dest === 'reset' && gameMode === 'tutorial') {
      dispatch(modalsActions.closeModal());
      return;
    }
    if (dest !== '/lobby') {
      dispatch(gameActions.resetState());
    }
    if (gameMode === 'online') {
      socket.emit('closeRoom', { roomId: curRoom, name }, (data) => {
        dispatch(gameActions.updateRooms({ rooms: data }));
      });
      dispatch(gameActions.setCurrentRoom({ room: '' }));
    }
    dispatch(modalsActions.closeModal());
    navigate(dest);
  };

  const handleClose = () => {
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.title}>{t('ResetWarning')}</h2>
        <PrimaryButton
          onClick={handleClick}
          showIcon={false}
          state="default"
          text={t('CONTINUE')}
          variant="primary"
          type="submit"
        />
        <PrimaryButton
          onClick={handleClose}
          showIcon={false}
          state="default"
          text={t('CLOSE')}
          variant="secondary"
          type="submit"
        />
      </div>
    </dialog>
  );
};

export default WarningResetWindow;
