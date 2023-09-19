import React, { useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import cn from 'classnames';
import { actions as gameActions } from '../../slices/gameSlice';
import { actions as battleActions } from '../../slices/battleSlice.js';
import { heroes } from '../../gameCardsData/factionsData';
import './MenuBtn.css';

const MenuBtn = ({
  text, type, data,
}) => {
  const option = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOptionClick = () => {
    const gameMode = option.current.dataset.type;
    dispatch(gameActions.setGameMode({ gameMode }));
    if (gameMode === 'tutorial') {
      dispatch(battleActions.setHeroes({
        player1Hero: heroes[0],
        player2Hero: heroes[1],
      }));
    }
    if (gameMode === 'hotseat') {
      dispatch(battleActions.addCommonPoint());
    }
    navigate('/hotseat');
  };

  return (
    <button
      ref={option}
      data-type={data}
      className={cn('choose-game__btn', { primary: type === 'primary', secondary: type === 'secondary' })}
      type="button"
      onClick={handleOptionClick}
    >
      {text}
    </button>
  );
};

export default MenuBtn;
