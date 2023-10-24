import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import socket from '../../socket';
import PrimaryButton from '../PrimaryButton.jsx';
import getModal from '../../modals/index.js';
import GameRoom from './GameRoom';
import styles from './OnlineLobby.module.css';

const OnlineLobby = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { rooms, name, onlineCount } = useSelector((state) => state.gameReducer);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal />;
  };

  const handleCreateClick = () => {
    dispatch(modalsActions.openModal({ type: 'onlineGameStart' }));
  };

  const handleBack = () => {
    navigate('/choose');
  };

  useEffect(() => {
    socket.on('rooms', (data) => {
      dispatch(gameActions.updateRooms({ rooms: data }));
    });
    if (name === '') {
      dispatch(modalsActions.openModal({ type: 'enterUsername' }));
    }
    socket.on('clientsCount', (count) => {
      dispatch(gameActions.setOnlineCount({ count }));
      console.log(count);
    });
  }, [dispatch, name]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PrimaryButton
          onClick={handleCreateClick}
          showIcon={false}
          state="default"
          text={t('CREATEROOM')}
          variant="primary"
          type="submit"
        />
        <PrimaryButton
          onClick={handleBack}
          showIcon={false}
          state="default"
          text={t('BACK')}
          variant="secondary"
        />
      </div>
      <div className={styles.infoContainer}>
        <div className={styles.infoBlock}>
          <h3 className={styles.nameText}>
            {t('YourName')}
            :
          </h3>
          <h2 className={styles.name}>{name}</h2>
        </div>
        <div className={styles.infoBlock}>
          <h3 className={styles.nameText}>
            {t('CurrentOnline')}
            :
          </h3>
          <h2 className={styles.name}>{onlineCount}</h2>
        </div>
      </div>
      <hr className={styles.divider} />
      <h2 className={styles.title}>{t('CurrentRooms')}</h2>
      <div className={styles.roomsBlock}>
        {rooms.length !== 0 && (
          rooms.map((room) => (
            <GameRoom room={room} key={room.roomId} />
          )))}
      </div>
      {renderModal(isOpened, type)}
    </div>
  );
};

export default OnlineLobby;
