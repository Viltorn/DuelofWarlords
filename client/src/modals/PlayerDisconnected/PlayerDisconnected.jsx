import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { actions as gameActions } from '../../slices/gameSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as uiActions } from '../../slices/uiSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './PlayerDisconnected.module.css';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';

const PlayerDisconnected = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { player, roomId } = useSelector((state) => state.modalsReducer);
  const { players, thisPlayer } = useSelector((state) => state.battleReducer);
  const { name } = players[thisPlayer];
  const { socket } = useFunctionsContext();

  const handleClick = () => {
    if (!player) {
      dispatch(gameActions.resetConnection());
      if (roomId && socket) {
        socket.emit('closeRoom', { roomId, name });
      }
    }
    dispatch(battleActions.resetState());
    dispatch(uiActions.resetState());
    dispatch(gameActions.setCurrentRoom({ room: '' }));
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        {player ? (
          <>
            <h2 className={styles.title}>{t('PlayerDisconnected')}</h2>
            <p className={styles.title}>{player}</p>
          </>
        ) : (
          <h2 className={styles.title}>{t('YouDisconnected')}</h2>
        )}
        <PrimaryButton
          onClick={handleClick}
          showIcon={false}
          state="default"
          text={t('buttons.CONTINUE')}
          variant="primary"
          type="submit"
        />
      </div>
    </dialog>
  );
};

export default PlayerDisconnected;
