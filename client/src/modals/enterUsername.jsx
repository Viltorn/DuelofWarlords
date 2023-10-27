import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import axios from 'axios';
import { actions as modalActions } from '../slices/modalsSlice.js';
import { actions as gameActions } from '../slices/gameSlice';
import { userName } from '../utils/validation.js';
import socket from '../socket';
import PrimaryButton from '../components/PrimaryButton.jsx';
import styles from './enterUsername.module.css';

const EnterUsername = () => {
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
        await axios.get('https://duelsofwarlords.onrender.com');
        socket.emit('username', { username }, (data) => {
          dispatch(gameActions.setPlayerName({ name: username }));
          const rooms = data ?? [];
          dispatch(gameActions.updateRooms({ rooms }));
          formik.setSubmitting(false);
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
    <dialog className={styles.window}>
      <div className={styles.content}>
        <h2 className={styles.header}>{t('YourName')}</h2>
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
            </div>
            <label htmlFor="username" className="visually-hidden">{t('YourName')}</label>
            <PrimaryButton
              showIcon={false}
              state="default"
              text={t('SEND')}
              variant="primary"
              type="submit"
            />
          </fieldset>
        </form>
      </div>
    </dialog>
  );
};

export default EnterUsername;
