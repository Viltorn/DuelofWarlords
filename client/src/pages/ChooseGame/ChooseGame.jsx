import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import getModal from '../../modals/index.js';
import { actions as modalsActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import gameVersion from '../../gameData/currentGameVer';
import MenuBtn from '../../components/Buttons/MenuBtn/MenuBtn.jsx';
import styles from './ChooseGame.module.css';
// import socket from '../../socket.js';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';

const ChooseGame = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    logged, userType, socketId, name,
  } = useSelector((state) => state.gameReducer);

  const { isOpened, type } = useSelector((state) => state.modalsReducer);
  const { socket, setSocket } = useFunctionsContext();

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
      socket.disconnect();
      setSocket(null);
      dispatch(gameActions.setSocketId({ socketId: '' }));
    }
    if (!logged) {
      dispatch(gameActions.setUserType({ userType: '' }));
    }
  };

  useEffect(() => {
    if (socket) {
      socket.emit('updateOnlineData', { username: name }, (data) => {
        const {
          id,
        } = data;
        dispatch(gameActions.setSocketId({ socketId: id }));
      });
    }
  }, [dispatch, name, socket]);

  useEffect(() => {
    if (!logged && userType !== 'guest') {
      dispatch(modalsActions.openModal({ type: 'loginWindow' }));
    }

    const updateSockId = (id) => {
      if (socketId !== id && socketId !== '') {
        dispatch(gameActions.setSocketId({ socketId: '' }));
        dispatch(gameActions.setLogged({ logged: false }));
        socket.disconnect();
        setSocket(null);
      }
    };

    socket?.on('getSocketId', updateSockId);
    return () => {
      socket?.off('getSocketId', updateSockId);
      // socket.off('rooms', updateOnlineRooms);
      // socket.off('clientsCount', updateCurOnline);
    };
  }, [dispatch, socketId, logged, userType, socket, setSocket]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={loginBtnStyle}
        aria-label="login button"
        onClick={handleLogBtnClick}
      >
        {logged ? t('buttons.EXIT') : t('buttons.ENTER')}
      </button>
      <p className={styles.version}>{gameVersion}</p>
      <div className={styles.options}>
        {logged && (
          <MenuBtn text={t('buttons.DECKBUILDER')} data="build" type="secondary" />
        )}
        <hr className={styles.divider} />
        <h2 className={styles.header}>{t('ChooseGame')}</h2>
        <MenuBtn text={t('buttons.TUTORIAL')} data="tutorial" type="primary" />
        <MenuBtn text={t('buttons.HOTSEAT')} data="hotseat" type="primary" />
        {logged && (
          <MenuBtn text={t('buttons.ONLINEGAME')} data="online" type="primary" />
        )}
      </div>
      {renderModal(isOpened, type)}
    </div>
  );
};

export default ChooseGame;
