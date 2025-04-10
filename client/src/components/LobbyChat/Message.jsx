import React from 'react';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';
import styles from './Message.module.css';
// import voiceMsg from '../assets/VoiceMsg.png';

const Message = ({ data, username }) => {
  const {
    body,
    senderName,
    idMessage,
  } = data;
  const { t } = useTranslation();
  const senderNameStyle = cn({
    [styles.youSender]: senderName === username,
    [styles.otherSender]: senderName !== username,
  });

  return (
    <div key={idMessage} className={styles.msgBlock}>
      <b className={styles.sender}>
        <span className={senderNameStyle}>{senderName === username ? (t('You')) : senderName}</span>
        {': '}
        <span className={styles.msg}>{body}</span>
      </b>
    </div>
  );
};

export default Message;
