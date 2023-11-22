import React, { useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
// import axios from 'axios';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import { userName } from '../../utils/validation.js';
import socket from '../../socket.js';
import styles from './enterUsername.module.css';

const ChatWindow = () => {
  // const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema: userName,
    onSubmit: async ({ username }) => {
      try {
        // await axios.get('https://duelsofwarlords.onrender.com');
        socket.emit('username', { username }, (id, data) => {
          console.log(id);
          dispatch(gameActions.setPlayerName({ name: username }));
          const rooms = data ?? [];
          dispatch(gameActions.updateRooms({ rooms }));
          dispatch(gameActions.setSocketId({ socketId: id }));
          handleClose();
        });
      } catch (err) {
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
  });

  return (
    <div className={styles.window} />
  );
};

export default ChatWindow;
