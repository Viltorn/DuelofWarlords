import React from 'react';
import ArrowLeft from '../assets/ArrowLeft.png';
import ArrowRight from '../assets/ArrowRight.png';
import styles from './MenuSlider.module.css';

const MenuSlider = ({ changeSlide, item, player }) => (
  <div className={styles.container}>
    <button type="button" className={styles.arrowBtn} onClick={() => changeSlide(-1, player)}>
      <img src={ArrowLeft} className={styles.btnImage} alt="arrow left" />
    </button>
    <div className={styles.mageBlock}>
      <img src={item.img} className={styles.image} alt="arrow left" />
    </div>
    <button type="button" className={styles.arrowBtn} onClick={() => changeSlide(1, player)}>
      <img src={ArrowRight} className={styles.btnImage} alt="arrow left" />
    </button>
  </div>
);

export default MenuSlider;
