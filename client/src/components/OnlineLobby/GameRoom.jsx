import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import styles from './GameRoom.module.css';

const GameRoom = ({ room }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { players, roomId } = room;

  const handleJoinClick = () => {
    dispatch(modalsActions.openModal({ type: 'onlineGameStart', roomId, name: players[0].username }));
  };

  return (
    <button type="button" className={styles.container} onClick={handleJoinClick}>
      <div className={styles.infoBlock}>
        <div className={styles.playersInfo}>
          <h3 className={styles.info}>{players[0].username}</h3>
        </div>
        <p className={styles.versus}>VS</p>
        {players.length > 1 ? (
          <div className={styles.playersInfo}>
            <h3 className={styles.info}>{players[1].username}</h3>
          </div>
        ) : (
          <p className={styles.info}>{t('EmptySlot')}</p>
        )}
      </div>
    </button>
  );
};

export default GameRoom;
