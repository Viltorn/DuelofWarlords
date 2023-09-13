import React from 'react';
import styles from './Tip.module.css';

const Tip = ({ h1, p }) => (
  <div className={styles.container}>
    <h4 className={styles.title}>{h1}</h4>
    <p className={styles.text}>{p}</p>
  </div>
);

export default Tip;
