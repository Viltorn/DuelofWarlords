import React from 'react';
import ChatWindow from './ChatWindow.jsx';
import styles from './Chat.module.css';

const Chat = () => (
  <div className={styles.window}>
    <ChatWindow />
  </div>
);

export default Chat;
