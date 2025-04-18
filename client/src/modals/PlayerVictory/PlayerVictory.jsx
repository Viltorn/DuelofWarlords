import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as uiActions } from '../../slices/uiSlice.js';
import PrimaryButton from '../../components/Buttons/PrimaryButton/PrimaryButton.jsx';
import styles from './PlayerVictory.module.css';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';

const PlayerVictory = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { player, roomId } = useSelector((state) => state.modalsReducer);
  const { players, thisPlayer } = useSelector((state) => state.battleReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);
  const { socket } = useFunctionsContext();
  const { name } = players[player];
  const thisPlayerName = players[thisPlayer].name;

  const handleClick = () => {
    dispatch(battleActions.resetState());
    dispatch(uiActions.resetState());
    if (gameMode === 'online') {
      if (socket) {
        socket.emit('closeRoom', { roomId, name: thisPlayerName });
      }
      dispatch(gameActions.setCurrentRoom({ room: '' }));
      navigate('/lobby');
    } else {
      navigate('/choose');
    }
    dispatch(modalsActions.closeModal());
  };

  return (
    <dialog className={styles.window}>
      <div className={styles.content}>
        <div className={styles.mainBlock}>
          <h2 className={styles.title}>{t('GameEnd')}</h2>
          <p className={styles.title}>{name}</p>
          <PrimaryButton
            onClick={handleClick}
            showIcon={false}
            state="default"
            text={t('buttons.CONTINUE')}
            variant="primary"
            type="submit"
          />
        </div>
      </div>
    </dialog>
  );
};

export default PlayerVictory;
