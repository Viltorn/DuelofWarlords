/* eslint-disable max-len */
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { actions as modalsActions } from '@slices/modalsSlice.js';
import { actions as gameActions } from '@slices/gameSlice';
import PrimaryButton from '@components/Buttons/PrimaryButton/PrimaryButton.jsx';
import DiscordLogo from '@assets/mainPageIcons/discord.svg';
import ChatLogo from '@assets/ChatRoom.png';
import GameRoom from './GameRoom/GameRoom';
import Chat from '../../components/LobbyChat/Chat.jsx';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';
import getModal from '../../modals/index.js';
import styles from './OnlineLobby.module.css';
// import socket from '../../socket.js';

const OnlineLobby = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    rooms, name, onlineCount, socketId,
  } = useSelector((state) => state.gameReducer);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const {
    setOpenChat, isOpenChat, socket, setSocket,
  } = useFunctionsContext();

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
    socket.emit('updateOnlineData', { username: name }, (data) => {
      const {
        newRooms, messages, players, id, playersNames,
      } = data;
      dispatch(gameActions.setMessages({ data: messages }));
      dispatch(gameActions.updateRooms({ rooms: newRooms }));
      dispatch(gameActions.setOnlineCount({ count: players }));
      dispatch(gameActions.setOnlinePlayers(playersNames));
      if (socketId === '') dispatch(gameActions.setSocketId({ socketId: id }));
    });
  }, [dispatch, name, socketId, socket]);

  useEffect(() => {
    const setMessages = (data) => {
      dispatch(gameActions.setMessages({ data }));
    };

    const addMessage = (data) => {
      dispatch(gameActions.addMessage({ data }));
    };

    const updateLobbyRooms = (data) => {
      dispatch(gameActions.updateRooms({ rooms: data }));
    };

    const updatePlayersOnline = (players) => {
      dispatch(gameActions.setOnlineCount({ count: players }));
    };

    const updatePlayersNames = (players) => {
      dispatch(gameActions.setOnlinePlayers(players));
    };

    const updateSocketId = (id) => {
      if (socketId !== id && socketId !== '') {
        dispatch(gameActions.setSocketId({ socketId: '' }));
        dispatch(gameActions.setLogged({ logged: false }));
        socket.disconnect();
        setSocket(null);
        navigate('/choose');
      }
    };

    socket.on('getMessages', setMessages);
    socket.on('message', addMessage);
    socket.on('getSocketId', updateSocketId);
    socket.on('rooms', updateLobbyRooms);
    socket.on('clientsCount', updatePlayersOnline);
    socket.on('playersNames', updatePlayersNames);

    return () => {
      socket.off('message', addMessage);
      socket.off('getMessages', setMessages);
      socket.off('getSocketId', updateSocketId);
      socket.off('rooms', updateLobbyRooms);
      socket.off('clientsCount', updatePlayersOnline);
    };
  }, [dispatch, socketId, navigate, socket, setSocket]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <PrimaryButton
          onClick={handleCreateClick}
          showIcon={false}
          state="default"
          text={t('buttons.CREATEROOM')}
          variant="primary"
          type="submit"
        />
        <PrimaryButton
          onClick={handleBack}
          showIcon={false}
          state="default"
          text={t('buttons.BACK')}
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
      <Chat status={isOpenChat} toogleChat={setOpenChat} type="message" />
    </div>
  );
};

export default OnlineLobby;
