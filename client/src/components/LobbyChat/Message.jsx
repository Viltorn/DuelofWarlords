import React from 'react';
import styles from './Message.module.css';
// import voiceMsg from '../assets/VoiceMsg.png';

const Message = ({ data }) => {
  const {
    body,
    senderName,
    idMessage,
  } = data;

  return (
    <div key={idMessage}>
      <b className={styles.sender}>
        {senderName}
        {': '}
      </b>
      &nbsp;
      <span className={styles.msg}>{body}</span>
    </div>
  );
};

export default Message;
