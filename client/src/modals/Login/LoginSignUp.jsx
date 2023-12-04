import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
// import axios from 'axios';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import { SignUpSchema } from '../../utils/validation.js';
import setAuthToken from '../../utils/setAuthToken.js';
import getAuthToken from '../../utils/getAuthToken.js';
import socket from '../../socket';
import PrimaryButton from '../../components/PrimaryButton.jsx';
import styles from './LoginSignUp.module.css';

const LoginSignUp = () => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const user = getAuthToken() ? getAuthToken.login : '';
  const pass = getAuthToken() ? getAuthToken.pass : '';

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  useEffect(() => {
    inputEl.current.focus();
    inputEl.current.select();
  }, []);

  const handleGuestClick = () => {
    dispatch(gameActions.setUserType({ userType: 'guest' }));
    dispatch(modalActions.closeModal());
  };

  const formik = useFormik({
    initialValues: {
      username: user,
      password: pass,
      repeatpass: '',
    },
    validationSchema: SignUpSchema,
    onSubmit: async ({ username, password }) => {
      try {
        setError(false);
        // await axios.get('https://duelsofwarlords.onrender.com');
        const emitType = signUp ? 'signUp' : 'logIn';
        socket.emit(emitType, { username, password }, (res) => {
          if (res.error) {
            setError(res);
            formik.setSubmitting(false);
            inputEl.current.focus();
            return;
          }
          const { id, rooms } = res;
          dispatch(gameActions.setPlayerName({ name: username }));
          dispatch(gameActions.updateRooms({ rooms }));
          dispatch(gameActions.setSocketId({ socketId: id }));
          dispatch(gameActions.setLogged({ logged: true }));
          dispatch(gameActions.setUserType({ userType: 'logged' }));
          if (emitType === 'signUp') {
            setAuthToken({ login: username, pass: password });
          }
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
        <h2 className={styles.header}>{signUp ? t('SignUp') : t('LogIn')}</h2>
        <div className={styles.guestBlock}>
          <button type="button" className={styles.guestBtn} onClick={handleGuestClick}>{t('GuestSignIn')}</button>
          <p className={styles.cantBuild}>{t('CantBuildDeck')}</p>
        </div>
        <form className={styles.form} onSubmit={formik.handleSubmit}>
          <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
            <div className={styles.inputContainer}>
              <div className={styles.inputBlock}>
                <input
                  className={styles.input}
                  id="username"
                  type="text"
                  ref={inputEl}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.username}
                  placeholder={t('LoginName')}
                  data-testid="input-body"
                  name="username"
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.username}`)}</div>
                ) : null}
              </div>
              <div className={styles.inputBlock}>
                <input
                  className={styles.input}
                  id="password"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.password}
                  placeholder={t('Password')}
                  data-testid="input-body"
                  name="password"
                />
                {formik.touched.password && formik.errors.password ? (
                  <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.password}`)}</div>
                ) : null}
              </div>
              <div className={styles.inputBlock}>
                {signUp && (
                <input
                  className={styles.input}
                  id="repeatpass"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.repeatpass}
                  placeholder={t('RepeatPassword')}
                  data-testid="input-body"
                  name="repeatpass"
                />
                )}
                {signUp && formik.errors.repeatpass && formik.touched && (
                <div className={styles.invalidFeedback}>{t(`errors.${formik.errors.repeatpass}`)}</div>
                )}
              </div>
              {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
            </div>
            <label htmlFor="username" className="visually-hidden">{t('YourName')}</label>
            <div className={styles.submitBlock}>
              <PrimaryButton
                showIcon={false}
                state="default"
                text={signUp ? t('SIGNUP') : t('ENTER')}
                variant="primary"
                type="submit"
              />
              <div className={styles.formTypeBlock}>
                <p className={styles.questionText}>{!signUp ? t('DontHaveAcc') : t('HaveAcc')}</p>
                <button className={styles.changeFormBtn} type="button" onClick={() => setSignUp((prev) => !prev)}>{!signUp ? t('SignUpLink') : t('LogInLink')}</button>
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    </dialog>
  );
};

export default LoginSignUp;
