import React from 'react';
import cn from 'classnames';
import './MenuBtn.css';

const MenuBtn = ({ text, handleClick, type }) => (
  <button
    className={cn('choose-game__btn', { primary: type === 'primary', secondary: type === 'secondary' })}
    type="button"
    onClick={handleClick}
  >
    {text}
  </button>
);

export default MenuBtn;
