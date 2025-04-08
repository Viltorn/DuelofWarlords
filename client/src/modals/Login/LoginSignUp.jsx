import React, {
  useState, useMemo,
} from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
import LoadSpinner from '@components/LoadSpinner/LoadSpinner.jsx';
// import socket from '../../socket.js';
import { io } from 'socket.io-client';
import makeAuth from '../../utils/makeAuth.js';
import { actions as modalActions } from '../../slices/modalsSlice.js';
import { actions as gameActions } from '../../slices/gameSlice';
import { SignUpSchema, LogInSchema } from '../../utils/validation.js';
import useFunctionsContext from '../../hooks/useFunctionsContext.js';
import standartDecks from '../../gameCardsData/standardDecks/standartDecks.js';
import LogInForm from './LogInForm.jsx';
import SignUpForm from './SignUpFrom.jsx';
import setAuthToken from '../../utils/setAuthToken.js';
import getAuthToken from '../../utils/getAuthToken.js';
import styles from './LoginSignUp.module.css';

const LoginSignUp = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const { setSocket } = useFunctionsContext();
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

  const submitForm = async (values, type, formik) => {
    try {
      setError(false);
      if (!captchaToken && type === 'signUp') {
        handleError({ message: 'captchaError' });
        formik.setSubmitting(false);
        return;
      }
      const { username, password } = values;
      const res = await makeAuth(username, password, type);
      console.log(res);
      if (res.status === 200 || res.status === 201) {
        console.log(res);
        const { decks } = res.data;
        dispatch(gameActions.setPlayerName({ name: username }));
        dispatch(gameActions.setLogged({ logged: true }));
        dispatch(gameActions.setUserType({ userType: 'logged' }));
        dispatch(gameActions.setDecks({ decks }));
        setAuthToken({ login: username, pass: password });
        handleClose();
        const socket = io(process.env.REACT_APP_HOST_URL, {
          autoConnect: true,
          auth: {
            username,
          },
        });
        setSocket(socket);
      }
    } catch (err) {
      formik.setSubmitting(false);
      handleError(err.response?.data ?? err);
      console.log(err.response?.data.message ?? err);
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
      {loginFormik.isSubmitting || signUpFormik.isSubmitting ? (
        <LoadSpinner />
      ) : (
        <div className={styles.content}>
          <h2 className={styles.header}>{signUp ? t('modals.SignUp') : t('modals.LogIn')}</h2>
          <div className={styles.guestBlock}>
            <button type="button" className={styles.guestBtn} onClick={handleGuestClick}>{t('modals.GuestSignIn')}</button>
            <p className={styles.cantBuild}>{t('modals.CantBuildDeck')}</p>
          </div>
          {signUp ? (
            <SignUpForm
              error={error}
              changeType={setSignUp}
              formik={signUpFormik}
              setCaptcha={setCaptchaToken}
              captcha={captchaToken}
            />
          ) : (
            <LogInForm error={error} changeType={setSignUp} formik={loginFormik} />
          )}
        </div>
      )}
    </dialog>
  );
};

export default LoginSignUp;
