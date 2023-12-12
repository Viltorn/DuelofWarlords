import React, {
  useState, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
// import cn from 'classnames';
// import axios from 'axios';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import { SignUpSchema, LogInSchema } from '../../utils/validation.js';
import standartDecks from '../../gameCardsData/standartDecks.js';
import LogInForm from './LogInForm.jsx';
import SignUpForm from './SignUpFrom.jsx';
import setAuthToken from '../../utils/setAuthToken.js';
import getAuthToken from '../../utils/getAuthToken.js';
import socket from '../../socket';
import styles from './LoginSignUp.module.css';

const LoginSignUp = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const token = useMemo(() => getAuthToken(), []);
  const user = useMemo(() => (token ? token.login : ''), [token]);
  const pass = useMemo(() => (token ? token.pass : ''), [token]);

  const handleClose = () => {
    dispatch(modalActions.closeModal());
  };

  const handleError = (err) => {
    setError(err.message);
    setTimeout(() => setError(false), 2000);
  };

  const handleGuestClick = () => {
    dispatch(gameActions.setUserType({ userType: 'guest' }));
    dispatch(gameActions.setDecks({ decks: standartDecks }));
    dispatch(modalActions.closeModal());
  };

  const submitForm = (values, type, formik) => {
    try {
      setError(false);
      const { username, password } = values;
      // await axios.get('https://duelsofwarlords.onrender.com');
      console.log(type);
      socket.emit(type, { username, password, decks: standartDecks }, (res) => {
        if (res.error) {
          handleError(res);
          formik.setSubmitting(false);
          // inputEl.current.focus();
          return;
        }
        const { id, rooms, decks } = res;
        dispatch(gameActions.setPlayerName({ name: username }));
        dispatch(gameActions.updateRooms({ rooms }));
        dispatch(gameActions.setSocketId({ socketId: id }));
        dispatch(gameActions.setLogged({ logged: true }));
        dispatch(gameActions.setUserType({ userType: 'logged' }));
        dispatch(gameActions.setDecks({ decks }));
        if (type === 'signUp') {
          setAuthToken({ login: username, pass: password });
        }
        handleClose();
      });
    } catch (err) {
      setError(err.message);
      console.log(err);
      formik.setSubmitting(false);
    }
  };

  const loginFormik = useFormik({
    initialValues: {
      username: user,
      password: pass,
    },
    validationSchema: LogInSchema,
    onSubmit: (values) => {
      submitForm(values, 'logIn', loginFormik);
    },
    validateOnChange: true,
  });

  const signUpFormik = useFormik({
    initialValues: {
      username: '',
      password: '',
      repeatpass: '',
    },
    validationSchema: SignUpSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      submitForm(values, 'signUp', signUpFormik);
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
        {signUp ? (
          <SignUpForm error={error} changeType={setSignUp} formik={signUpFormik} />
        ) : (
          <LogInForm error={error} changeType={setSignUp} formik={loginFormik} />
        )}
      </div>
    </dialog>
  );
};

export default LoginSignUp;
