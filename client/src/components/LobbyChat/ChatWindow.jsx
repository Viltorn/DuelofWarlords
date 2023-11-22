import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
// import axios from 'axios';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice.js';
import { userName } from '../../utils/validation.js';
import socket from '../../socket.js';
import styles from './ChatWindow.module.css';

const ChatWindow = () => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);

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
        setError(false);
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
        setError(err.message);
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: true,
  });

  return (
    <div className={styles.window}>
      <h2 className={styles.header}>{t('ChatHeader')}</h2>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
          <div className={styles.inputBlock}>
            <input
              className={styles.input}
              id="username"
              type="text"
              ref={inputEl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
              data-testid="input-body"
              name="username"
            />
            {formik.errors.username ? (
              <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.username}`)}</div>
            ) : null}
            {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
            <label htmlFor="username" className="visually-hidden">{t('YourName')}</label>
            <button
              type="submit"
              disabled={!formik.dirty || formik.isSubmitting}
              className="btn btn-light btn-group-vertical"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="currentColor">
                <path fillRule="evenodd" d="M15 2a1 1 0 0 0-1-1H2a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V2zM0 2a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2zm4.5 5.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z" />
              </svg>
              <span className="visually-hidden">{t('Send')}</span>
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ChatWindow;
