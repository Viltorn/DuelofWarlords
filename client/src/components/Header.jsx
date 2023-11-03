import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import { maxActionPoints } from '../gameData/gameLimits';
import tutorialStepsData from '../gameData/tutorialStepsData';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import Menu from '../assets/Menu.svg';
import styles from './Header.module.css';

const Header = () => {
  const { t } = useTranslation();
  const {
    thisPlayer,
    playerPoints,
    commonPoints,
    fieldCells,
    players,
    gameTurn,
  } = useSelector((state) => state.battleReducer);
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const {
    changeTutorStep, tutorStep, setOpenMenu, isOpenMenu,
  } = useContext(functionContext);
  const {
    endTurn,
    actionPerforming,
    makeOnlineAction,
  } = useContext(abilityContext);
  const player1Points = playerPoints.find((item) => item.player === 'player1').points;
  const player2Points = playerPoints.find((item) => item.player === 'player2').points;
  const dispatch = useDispatch();
  const { disEndTurn } = tutorialStepsData[tutorStep];

  const hadleEndTurnClick = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    const newPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    const newCommonPoints = commonPoints < maxActionPoints ? commonPoints + 1 : maxActionPoints;
    if (gameMode === 'tutorial') {
      dispatch(battleActions.setPlayerPoints({ points: newCommonPoints, player: 'player1' }));
      dispatch(battleActions.addCommonPoint());
      dispatch(battleActions.drawCard({ player: 'player1' }));
      dispatch(battleActions.turnPostponed({ player: 'player1', status: 'face' }));
      changeTutorStep((prev) => prev + 1);
      return;
    }
    if (gameTurn !== thisPlayer) {
      return;
    }
    const postponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
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

    const data = {
      move: 'endTurn',
      room: curRoom,
      newPlayer,
      commonPoints,
      newCommonPoints,
      postponedCell,
      temporarySpells,
      turnSpells,
    };

    if (gameMode === 'online') {
      makeOnlineAction(data);
    } else {
      endTurn(data);
    }
  };

  const handlePointsClick = (player) => {
    dispatch(modalsActions.openModal({ type: 'openPointsCounter', player }));
  };

  const handleMenuClick = () => {
    setOpenMenu((prev) => !prev);
  };

  const playerOneBlock = cn({
    [styles.titleBlock]: true,
    [styles.turnAnimation]: gameTurn === 'player1',
  });

  const playerTwoBlock = cn({
    [styles.titleBlock]: true,
    [styles.turnAnimation]: gameTurn === 'player2',
  });

  return (
    <div className={styles.container} style={thisPlayer === 'player1' ? { left: 0 } : { right: 0 }}>
      <div className={styles.centralBlock}>
        {thisPlayer === 'player1' && (
          <button style={{ transform: isOpenMenu ? 'rotate(90deg)' : 'rotate(0)' }} type="button" onClick={handleMenuClick} className={styles.menuBtn}>
            <img src={Menu} alt="menu" />
          </button>
        )}
        <div className={styles.playersInfo}>
          <div className={playerOneBlock}>
            <h3 className={styles.title}>
              {t('Player1')}
              :
            </h3>
            <h3 className={styles.title}>
              {' '}
              {players.player1.name}
            </h3>
          </div>
          <button type="button" onClick={() => handlePointsClick('player1')} disabled={gameMode !== 'hotseat'} className={styles.counter}>
            <h3 className={styles.counterNum}>{player1Points}</h3>
          </button>
        </div>
        <button className={styles.endturnBtn} type="button" disabled={disEndTurn && gameMode === 'tutorial'} onClick={hadleEndTurnClick}>
          {t('EndTurn')}
        </button>
        <div className={styles.playersInfo}>
          <button type="button" onClick={() => handlePointsClick('player2')} disabled={gameMode !== 'hotseat'} className={styles.counter}>
            <h3 className={styles.counterNum}>{player2Points}</h3>
          </button>
          <div className={playerTwoBlock}>
            <h3 className={styles.title}>
              {t('Player2')}
              :
            </h3>
            <h3 className={styles.title}>
              {' '}
              {players.player2.name}
            </h3>
          </div>
        </div>
        {thisPlayer === 'player2' && (
          <button type="button" style={{ transform: isOpenMenu ? 'rotate(90deg)' : 'rotate(0)' }} onClick={handleMenuClick} className={styles.menuBtn}>
            <img src={Menu} alt="menu" />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
