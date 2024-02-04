import React from 'react';
import styles from './GameFeature.module.css';

const GameFeature = ({
  img, direction, h1, p,
}) => (
  <div className={direction === 'reverse' ? styles.containerR : styles.container}>
    <img className={styles.featureImg} alt="battlefield feature" src={img} />
    <div className={styles.featuresSet}>
      <h1 className={styles.title}>
        {h1}
      </h1>
      <p className={styles.featureText}>
        {p}
      </p>
    </div>
  </div>
);

export default GameFeature;
