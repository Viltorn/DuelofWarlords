import React from 'react';
import ArrowLeft from '../../assets/ArrowLeft.png';
import ArrowRight from '../../assets/ArrowRight.png';
import './MenuSlider.css';

const MenuSlider = ({ changeSlide, item, player }) => (
  <div className="menu-slider">
    <button type="button" className="menu-slider__arrow-btn" onClick={() => changeSlide(-1, player)}>
      <img src={ArrowLeft} className="menu-slider__btn-image" alt="arrow left" />
    </button>
    <div className="menu-slider__image-block">
      <img src={item.img} className="menu-slider_image" alt="arrow left" />
    </div>
    <button type="button" className="menu-slider__arrow-btn" onClick={() => changeSlide(1, player)}>
      <img src={ArrowRight} className="menu-slider__btn-image" alt="arrow left" />
    </button>
  </div>
);

export default MenuSlider;
