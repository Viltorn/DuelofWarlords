import React from 'react';
import styles from './GameFaction.module.css';

const GameFaction = ({ faction, hero }) => (
  <div className={styles.card}>
    <div className={styles.wrapper}>
      <img src={faction} alt="faction logo" className={styles.coverImage} />
    </div>
    <img src={hero} alt="hero logo" className={styles.character} />
  </div>
);

export default GameFaction;
