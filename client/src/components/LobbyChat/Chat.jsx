import React from 'react';
import cn from 'classnames';
import ChatWindow from './ChatWindow.jsx';
import styles from './Chat.module.css';

const Chat = ({
  status, toogleChat, type, player,
}) => {
  const window = cn({
    [styles.window]: true,
    [styles.open]: status,
    [styles.closed]: !status,
    [styles.left]: player === 'player2',
  });
  return (
    <div className={window}>
      <ChatWindow toogleChat={toogleChat} type={type} player={player} />
    </div>
  );
};

export default Chat;
