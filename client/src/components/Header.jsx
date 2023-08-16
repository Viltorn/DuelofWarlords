import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PrimaryButton from './PrimaryButton';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { maxActionPoints } from '../gameData/gameLimits';
import './Header.css';

const Header = () => {
  const { t } = useTranslation();
  const {
    thisPlayer, playerPoints, commonPoints,
  } = useSelector((state) => state.battleReducer);
  const player1Points = playerPoints.find((item) => item.player === 'player1').points;
  const player2Points = playerPoints.find((item) => item.player === 'player2').points;
  const dispatch = useDispatch();

  const hadleEndTurnClick = () => {
    const newPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    const newCommonPoints = commonPoints < maxActionPoints ? commonPoints + 1 : maxActionPoints;
    if (newPlayer === 'player2') {
      dispatch(battleActions.setPlayerPoints({ points: commonPoints, player: 'player2' }));
    } else {
      if (commonPoints < maxActionPoints) {
        dispatch(battleActions.addCommonPoint());
      }
      dispatch(battleActions.setPlayerPoints({ points: newCommonPoints, player: 'player1' }));
    }
    dispatch(battleActions.turnPosponed({ player: newPlayer, status: 'face' }));
    dispatch(battleActions.drawCard({ player: newPlayer }));
    dispatch(battleActions.massTurnCards({ player: newPlayer }));
    dispatch(battleActions.changePlayer({ newPlayer }));
  };

  const handlePointsClick = (player) => {
    dispatch(modalsActions.openModal({ type: 'openPointsCounter', player }));
  };

  const handleResetClick = () => {
    dispatch(battleActions.resetState());
    dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
  };

  return (
    <div className="header">
      <button type="button" onClick={handleResetClick} className="header__reset-btn">{t('ResetBtn')}</button>
      <div className="header__central-block">
        <div className="header__players-info">
          <h3 className="header__title">
            {t('Player1')}
            :
          </h3>
          <h3 className="header__title">
            {' '}
            Viktor
          </h3>
        </div>
        <button type="button" onClick={() => handlePointsClick('player1')} className="header__counter">
          <h3 className="header__counter_num">{player1Points}</h3>
        </button>
        <PrimaryButton
          showIcon={false}
          state="default"
          text="ЗАКОНЧИТЬ ХОД"
          variant="primary"
          onClick={hadleEndTurnClick}
        />
        <button type="button" onClick={() => handlePointsClick('player2')} className="header__counter">
          <h3 className="header__counter_num">{player2Points}</h3>
        </button>
        <div className="header__players-info">
          <h3 className="header__title">
            {t('Player2')}
            :
          </h3>
          <h3 className="header__title">
            {' '}
            AI
          </h3>
        </div>
      </div>
      <div />
    </div>
  );
};

export default Header;
