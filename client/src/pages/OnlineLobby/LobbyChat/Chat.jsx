import React from 'react';
import cn from 'classnames';
import ChatWindow from './ChatWindow.jsx';
import styles from './Chat.module.css';

const Chat = ({ status, toogleChat }) => {
  const window = cn({
    [styles.window]: true,
    [styles.open]: status,
    [styles.closed]: !status,
  });
  return (
    <div className={window}>
      <ChatWindow toogleChat={toogleChat} />
    </div>
  );
};

export default Chat;
