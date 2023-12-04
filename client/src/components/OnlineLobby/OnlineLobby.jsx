import React, { useEffect, useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import PrimaryButton from '../PrimaryButton.jsx';
import getModal from '../../modals/index.js';
import GameRoom from './GameRoom';
import Chat from '../LobbyChat/Chat.jsx';
import functionContext from '../../contexts/functionsContext.js';
import DiscordLogo from '../../assets/MainPage/discord.svg';
import ChatLogo from '../../assets/ChatRoom.png';
import styles from './OnlineLobby.module.css';
import socket from '../../socket.js';

const OnlineLobby = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    rooms, name, onlineCount, socketId, logged,
  } = useSelector((state) => state.gameReducer);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const { setOpenChat, isOpenChat } = useContext(functionContext);

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
    // if (name === '') {
    //   dispatch(modalsActions.openModal({ type: 'enterUsername' }));
    // }
    const updateLobbyRooms = (data) => {
      dispatch(gameActions.updateRooms({ rooms: data }));
    };

    const updatePlayersOnline = (players) => {
      dispatch(gameActions.setOnlineCount({ count: players }));
      console.log(players);
    };

    const updateSocketId = (id) => {
      if (socketId !== id && socketId !== '') {
        dispatch(gameActions.setSocketId({ socketId: id }));
        dispatch(gameActions.setLogged({ logged: false }));
        navigate('/choose');
      }
    };

    socket.on('getSocketId', updateSocketId);
    socket.on('rooms', updateLobbyRooms);
    socket.on('clientsCount', updatePlayersOnline);

    return () => {
      socket.off('getSocketId', updateSocketId);
      socket.off('rooms', updateLobbyRooms);
      socket.off('clientsCount', updatePlayersOnline);
    };
  }, [name, dispatch, socketId, logged, navigate]);

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
        <div className={styles.infoBlock}>
          <h3 className={styles.nameText}>{t('VoiceLobby')}</h3>
          <a href="https://discord.gg/JWFBjKK9" target="_blank" rel="noreferrer"><img className={styles.discord} src={DiscordLogo} alt="discord logo" /></a>
        </div>
        <div className={styles.infoBlock}>
          <h3 className={styles.nameText}>{t('Chat')}</h3>
          <button className={styles.chatBtn} type="button" onClick={() => setOpenChat((prev) => !prev)}><img className={styles.discord} src={ChatLogo} alt="chat logo" /></button>
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
      <Chat status={isOpenChat} toogleChat={setOpenChat} />
    </div>
  );
};

export default OnlineLobby;
