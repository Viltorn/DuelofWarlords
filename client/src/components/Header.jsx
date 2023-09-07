import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { maxActionPoints } from '../gameData/gameLimits';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import Menu from '../assets/Menu.svg';
import './Header.css';

const Header = () => {
  const { t } = useTranslation();
  const {
    thisPlayer, playerPoints, commonPoints, activeCardPlayer1, activeCardPlayer2, fieldCells,
  } = useSelector((state) => state.battleReducer);
  const {
    handleAnimation, deleteOtherActiveCard,
  } = useContext(functionContext);
  const { sendCardFromField } = useContext(abilityContext);
  const player1Points = playerPoints.find((item) => item.player === 'player1').points;
  const player2Points = playerPoints.find((item) => item.player === 'player2').points;
  const dispatch = useDispatch();

  const hadleEndTurnClick = () => {
    const newPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    const newCommonPoints = commonPoints < maxActionPoints ? commonPoints + 1 : maxActionPoints;
    const posponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
    const temporarySpells = fieldCells
      .filter((cell) => cell.content.length !== 0 && cell.type !== 'postponed')
      .reduce((arr, cell) => {
        const spells = cell.content.filter((el) => el.subtype === 'temporary' && el.player === newPlayer);
        arr = [...arr, ...spells];
        return arr;
      }, []);
    const turnSpells = fieldCells
      .filter((cell) => cell.content.length !== 0 && cell.type !== 'postponed')
      .reduce((arr, cell) => {
        const spells = cell.content.filter((el) => el.subtype === 'turn' && el.player === thisPlayer);
        arr = [...arr, ...spells];
        return arr;
      }, []);

    if (newPlayer === 'player2') {
      dispatch(battleActions.setPlayerPoints({ points: commonPoints, player: 'player2' }));
    } else {
      if (commonPoints < maxActionPoints) {
        dispatch(battleActions.addCommonPoint());
      }
      dispatch(battleActions.setPlayerPoints({ points: newCommonPoints, player: 'player1' }));
    }
    if (posponedCell.status === 'face') {
      const card = posponedCell.content[0];
      sendCardFromField(card, 'return');
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      deleteOtherActiveCard(activeCardPlayer1, activeCardPlayer2, thisPlayer);
    }
    handleAnimation(activeCardPlayer2, 'delete');
    dispatch(battleActions.turnPostponed({ player: newPlayer, status: 'face' }));
    dispatch(battleActions.drawCard({ player: newPlayer }));
    dispatch(battleActions.massTurnCards({ player: newPlayer }));
    dispatch(battleActions.changePlayer({ newPlayer }));
    [...turnSpells, ...temporarySpells].forEach((spell) => sendCardFromField(spell, 'grave'));
  };

  const handlePointsClick = (player) => {
    dispatch(modalsActions.openModal({ type: 'openPointsCounter', player }));
  };

  const handleResetClick = () => {
    dispatch(battleActions.resetState());
    dispatch(modalsActions.openModal({ type: 'openHotSeatMenu' }));
  };

  return (
    <div className="header" style={thisPlayer === 'player1' ? { left: 0 } : { right: 0 }}>
      <div className="header__central-block">
        {thisPlayer === 'player1' && (
          <button type="button" onClick={handleResetClick} className="header__menu-btn">
            <img src={Menu} alt="menu" />
          </button>
        )}
        <div className="header__players-info">
          <h3 className="header__title">
            {t('Player1')}
            :
          </h3>
          <h3 className="header__title">
            {' '}
            Viktor
          </h3>
          <button type="button" onClick={() => handlePointsClick('player1')} className="header__counter">
            <h3 className="header__counter_num">{player1Points}</h3>
          </button>
        </div>
        <button className="header__endturn-btn" type="button" onClick={hadleEndTurnClick}>
          {t('EndTurn')}
        </button>
        <div className="header__players-info">
          <button type="button" onClick={() => handlePointsClick('player2')} className="header__counter">
            <h3 className="header__counter_num">{player2Points}</h3>
          </button>
          <h3 className="header__title">
            {t('Player2')}
            :
          </h3>
          <h3 className="header__title">
            {' '}
            AI
          </h3>
        </div>
        {thisPlayer === 'player2' && (
          <button type="button" onClick={handleResetClick} className="header__menu-btn">
            <img src={Menu} alt="menu" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
