import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import Menu from '@assets/Menu.svg';
import { actions as battleActions } from '@slices/battleSlice.js';
import { actions as modalsActions } from '@slices/modalsSlice.js';
import { maxActionPoints } from '../../../gameData/gameLimits.js';
import findActiveWarCard from '../../../utils/supportFunc/findActiveWarCard.js';
import findTempSpellsOnField from '../../../utils/supportFunc/findTempSpellsOnField.js';
import findTurnSpellsOnField from '../../../utils/supportFunc/findTurnSpellsOnField.js';
import tutorialStepsData from '../../../gameData/tutorialStepsData.js';
import functionContext from '../../../contexts/functionsContext.js';
import abilityContext from '../../../contexts/abilityActions.js';
import styles from './BattleHeader.module.css';

const BattleHeader = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const {
    thisPlayer,
    playerPoints,
    commonPoints,
    fieldCells,
    fieldCards,
    players,
    gameTurn,
  } = useSelector((state) => state.battleReducer);

  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);
  const {
    changeTutorStep, tutorStep, setOpenMenu, isOpenMenu,
  } = useContext(functionContext);
  const {
    actionPerforming,
    makeGameAction,
  } = useContext(abilityContext);
  const player1Points = playerPoints.find((item) => item.player === 'player1').points;
  const player2Points = playerPoints.find((item) => item.player === 'player2').points;
  const { disEndTurn } = tutorialStepsData[tutorStep];

  const endTurnInTutorial = (newPoints) => {
    dispatch(battleActions.setPlayerPoints({ points: newPoints, player: 'player1' }));
    dispatch(battleActions.addCommonPoint());
    dispatch(battleActions.drawCard({ player: 'player1' }));
    dispatch(battleActions.turnPostponed({ player: 'player1', status: 'face' }));
    changeTutorStep((prev) => prev + 1);
  };

  const hadleEndTurnClick = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    const newPlayer = thisPlayer === 'player1' ? 'player2' : 'player1';
    const newCommonPoints = commonPoints < maxActionPoints ? commonPoints + 1 : maxActionPoints;
    if (gameMode === 'tutorial') {
      endTurnInTutorial(newCommonPoints);
      return;
    }
    if (gameTurn !== thisPlayer) {
      return;
    }
    const postponedCell = fieldCells.find((cell) => cell.type === 'postponed' && cell.player === thisPlayer);
    const temporarySpells = findTempSpellsOnField(fieldCards, newPlayer);
    const turnSpells = findTurnSpellsOnField(fieldCards, thisPlayer);
    const activeWarCard = findActiveWarCard(fieldCards, thisPlayer);

    const data = {
      move: 'endTurn',
      room: curRoom,
      newPlayer,
      commonPoints,
      newCommonPoints,
      postponedCell,
      temporarySpells,
      turnSpells,
      cellsOnField: fieldCells,
      cardsOnField: fieldCards,
    };

    if (activeWarCard && gameMode === 'online') {
      dispatch(modalsActions.openModal({ type: 'endTurnWarning', data }));
      return;
    }

    makeGameAction(data, gameMode);
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

export default BattleHeader;
