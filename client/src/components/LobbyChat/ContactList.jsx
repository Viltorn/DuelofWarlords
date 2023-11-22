import React from 'react';
import { useSelector } from 'react-redux';
import Player from './Player.jsx';
import styles from './enterUsername.module.css';

const EnterUsername = () => {
  const {
    onlinePlayers,
  } = useSelector((state) => state.gameReducer);

  return (
    <div className={styles.window}>
      <ul>
        {onlinePlayers.map((player) => (
          <Player key={player.id} username={player.username} />
        ))}
      </ul>
    </div>
  );
};

export default EnterUsername;
