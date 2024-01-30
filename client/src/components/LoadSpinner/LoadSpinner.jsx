/* eslint-disable */
import React from 'react';
import styles from './LoadSpinner.module.css';

const LoadSpinner = () => {
return (
<div className={styles.container}>
<div className={styles.ldsEllipsis}>
  <div></div>
  <div></div>
  <div></div>
  <div></div>
</div>
</div>
)
};

export default LoadSpinner;
