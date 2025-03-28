import React from 'react';
import ArrowLeft from '@assets/ArrowLeft.png';
import ArrowRight from '@assets/ArrowRight.png';
import styles from './MenuSlider.module.css';

const MenuSlider = ({
  changeSlide, item, player,
}) => {
  const moveSlideLeft = () => {
    changeSlide(-1, player);
  };

  return (
    <div className={styles.container}>
      <button type="button" className={styles.arrowBtn} onClick={moveSlideLeft}>
        <img src={ArrowLeft} className={styles.btnImage} alt="arrow left" />
      </button>
      <div className={styles.imageBlock}>
        <img src={item.img} key={item.name} className={styles.image} alt="hero icon" />
      </div>
      <button type="button" className={styles.arrowBtn} onClick={() => changeSlide(1, player)}>
        <img src={ArrowRight} className={styles.btnImage} alt="arrow right" />
      </button>
    </div>
  );
};

export default MenuSlider;
