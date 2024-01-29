import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import getModal from '../../modals/index.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import gameVersion from '../../gameData/currentGameVer';
import socket from '../../socket.js';
import MenuBtn from '../../components/Buttons/MenuBtn/MenuBtn.jsx';
import styles from './ChooseGame.module.css';

const ChooseGame = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    logged, userType, socketId,
  } = useSelector((state) => state.gameReducer);
  const { isOpened, type } = useSelector((state) => state.modalsReducer);

  const loginBtnStyle = cn({
    [styles.loginBtn]: true,
    [styles.primary]: !logged,
    [styles.secondary]: logged,
  });

  const renderModal = (status, option) => {
    if (!status) {
      return null;
    }
    const Modal = getModal(option);
    return <Modal />;
  };

  const handleLogBtnClick = () => {
    if (logged) {
      dispatch(gameActions.setLogged({ logged: false }));
    } else {
      dispatch(gameActions.setUserType({ userType: '' }));
    }
  };

  useEffect(() => {
    if (!logged && userType !== 'guest') {
      dispatch(modalsActions.openModal({ type: 'loginWindow' }));
    }
    const updateOnlineRooms = (data) => {
      dispatch(gameActions.updateRooms({ rooms: data }));
    };

    const updateCurOnline = (players) => {
      dispatch(gameActions.setOnlineCount({ count: players }));
      console.log(players);
    };

    const updateSockId = (id) => {
      if (socketId !== id && socketId !== '') {
        dispatch(gameActions.setSocketId({ socketId: id }));
        dispatch(gameActions.setLogged({ logged: false }));
      }
    };

    socket.on('getSocketId', updateSockId);
    socket.on('rooms', updateOnlineRooms);
    socket.on('clientsCount', updateCurOnline);

    return () => {
      socket.off('getSocketId', updateSockId);
      socket.off('rooms', updateOnlineRooms);
      socket.off('clientsCount', updateCurOnline);
    };
  }, [dispatch, socketId, logged, userType]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={loginBtnStyle}
        aria-label="login button"
        onClick={handleLogBtnClick}
      >
        {logged ? t('EXIT') : t('ENTER')}
      </button>
      <p className={styles.version}>{gameVersion}</p>
      <div className={styles.options}>
        {logged && (
          <MenuBtn text={t('DeckBuilder')} data="build" type="secondary" />
        )}
        <hr className={styles.divider} />
        <h2 className={styles.header}>{t('ChooseGame')}</h2>
        <MenuBtn text={t('Tutorial')} data="tutorial" type="primary" />
        <MenuBtn text={t('HotSeat')} data="hotseat" type="primary" />
        {logged && (
          <MenuBtn text={t('OnlineGame')} data="online" type="primary" />
        )}
      </div>
      {renderModal(isOpened, type)}
    </div>
  );
};

export default ChooseGame;
