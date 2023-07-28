import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import PrimaryButton from './PrimaryButton';
import { actions as battleActions } from '../slices/battleSlice.js';

const maxPoints = 9;

const Header = () => {
  const { t } = useTranslation();
  const {
    thisPlayer, player1Points, player2Points, commonPoints,
  } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();

  const hadleEndTurn = () => {
    const newPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    const newCommonPoints = commonPoints < maxPoints ? commonPoints + 1 : maxPoints;
    if (newPlayer === 'player2') {
      dispatch(battleActions.setPlayerPoints({ points: commonPoints, player: 'player2' }));
    } else {
      if (commonPoints < maxPoints) {
        dispatch(battleActions.addCommonPoint());
      }
      dispatch(battleActions.setPlayerPoints({ points: newCommonPoints, player: 'player1' }));
    }
    dispatch(battleActions.changePlayer({ newPlayer }));
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
      <div className="counter">
        <h3 className="counter-number">{player1Points}</h3>
      </div>
      <PrimaryButton
        showIcon={false}
        state="default"
        text="ЗАКОНЧИТЬ ХОД"
        variant="primary"
        onClick={hadleEndTurn}
      />
      <div className="counter">
        <h3 className="counter-number">{player2Points}</h3>
      </div>
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
