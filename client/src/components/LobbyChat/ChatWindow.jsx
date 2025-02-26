import React, { useRef, useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { useFormik } from 'formik';
// import axios from 'axios';
import CloseBtn from '@assets/CloseBtn.svg';
import Message from './Message.jsx';
import socket from '../../socket.js';
import styles from './ChatWindow.module.css';

const ChatWindow = ({ toogleChat, type, player }) => {
  const { t } = useTranslation();
  const inputEl = useRef();
  const [error, setError] = useState(false);
  const {
    messages, name, curRoom,
  } = useSelector((state) => state.gameReducer);
  const { roomMsgs } = useSelector((state) => state.battleReducer);

  const formik = useFormik({
    initialValues: {
      message: '',
    },
    onSubmit: async ({ message }) => {
      try {
        setError(false);
        socket.emit(type, {
          message, name, room: curRoom, player,
        }, () => {
          inputEl.current.focus();
          formik.resetForm();
        });
      } catch (err) {
        setError(err.message);
        console.log(err);
        formik.setSubmitting(false);
      }
    },
    validateOnChange: false,
  });

  useEffect(() => {
    if (inputEl && inputEl.current) {
      inputEl.current.style.height = '0px';
      const inputElHeight = inputEl.current.scrollHeight;
      inputEl.current.style.height = `${inputElHeight}px`;
    }
  }, [formik.values.message]);

  return (
    <div className={styles.window}>
      <div className={styles.headBlock}>
        <button onClick={() => toogleChat(false)} className={styles.closeBtn} type="button"><img src={CloseBtn} alt="close" /></button>
        <h2 className={styles.header}>{t('ChatHeader')}</h2>
      </div>
      <div className={styles.chatBlock}>
        {type === 'message' && (messages.map((item) => <Message key={item.id} data={item} />))}
        {type === 'messageRoom' && (roomMsgs.map((item) => <Message key={item.id} data={item} />))}
      </div>
      <form className={styles.form} onSubmit={formik.handleSubmit}>
        <fieldset className={styles.fieldset} disabled={formik.isSubmitting}>
          <div className={styles.inputBlock}>
            <textarea
              className={styles.input}
              id="message"
              type="text"
              ref={inputEl}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
              data-testid="input-body"
              name="message"
              rows="1"
              cols="33"
            />
            {error && (<div className={styles.invalidFeedback}>{t(`errors.${error}`)}</div>)}
            <label htmlFor="message" className="visually-hidden">{t('Message')}</label>
            <button
              type="submit"
              disabled={!formik.dirty || formik.isSubmitting}
              className={styles.sendBtn}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20" fill="#fbb270">
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
