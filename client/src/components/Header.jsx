import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PrimaryButton from './PrimaryButton';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { maxActionPoints } from '../gameData/gameLimits';

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
    dispatch(battleActions.drawCard({ player: newPlayer }));
    dispatch(battleActions.changePlayer({ newPlayer }));
  };

  const handlePointsClick = (player) => {
    dispatch(modalsActions.openModal({ type: 'openPointsCounter', player }));
  };

  return (
    <div className="header">
      <div className="players-info">
        <h3 className="title-main-font">
          {t('Player1')}
          :
        </h3>
        <h3 className="title-main-font">
          {' '}
          Viktor
        </h3>
      </div>
      <button type="button" onClick={() => handlePointsClick('player1')} className="counter">
        <h3 className="counter-number">{player1Points}</h3>
      </button>
      <PrimaryButton
        showIcon={false}
        state="default"
        text="ЗАКОНЧИТЬ ХОД"
        variant="primary"
        onClick={hadleEndTurnClick}
      />
      <button type="button" onClick={() => handlePointsClick('player2')} className="counter">
        <h3 className="counter-number">{player2Points}</h3>
      </button>
      <div className="players-info">
        <h3 className="title-main-font">
          {t('Player2')}
          :
        </h3>
        <h3 className="title-main-font">
          {' '}
          AI
        </h3>
      </div>
    </div>
  );
};

export default Header;
