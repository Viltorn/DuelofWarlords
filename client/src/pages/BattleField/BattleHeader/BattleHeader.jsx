/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import Menu from '@assets/Menu.png';
import CombatLogImg from '@assets/CombatLog.png';
import useClickActions from '../../../hooks/useClickActions.js';
import tutorialStepsData from '../../../gameData/tutorialStepsData.js';
import useFunctionsContext from '../../../hooks/useFunctionsContext.js';
import styles from './BattleHeader.module.css';

const BattleHeader = () => {
  const { t } = useTranslation();

  const {
    hadleEndTurnClick,
    handleMenuClick,
    handleBattleLogClick,
  } = useClickActions();

  const { gameMode } = useSelector((state) => state.gameReducer);
  const {
    thisPlayer,
    players,
    gameTurn,
    currentTutorStep,
  } = useSelector((state) => state.battleReducer);

  const { type } = useSelector((state) => state.modalsReducer);
  const { isOpenMenu } = useFunctionsContext();
  const { disEndTurn } = tutorialStepsData[currentTutorStep];

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
          <>
            <button style={{ transform: isOpenMenu ? 'rotate(90deg)' : 'rotate(0)' }} type="button" onClick={handleMenuClick} className={styles.menuBtn}>
              <img src={Menu} alt="menu" />
            </button>
            {gameMode !== 'tutorial' && (
            <button style={{ transform: type === 'combatLog' ? 'rotate(90deg)' : 'rotate(0)' }} type="button" onClick={handleBattleLogClick} className={styles.menuBtn}>
              <img src={CombatLogImg} alt="combat log" />
            </button>
            )}
          </>
        )}
        <div className={styles.infoContainer}>
          <div className={styles.playersInfo}>
            <div className={playerOneBlock}>
              <h3 className={styles.title}>
                {t('Player1')}
                :
              </h3>
              <h3 className={styles.playerTitle}>
                {' '}
                {players.player1.name}
              </h3>
            </div>
          </div>
          <button className={styles.endTurnBtn} type="button" disabled={disEndTurn && gameMode === 'tutorial'} onClick={hadleEndTurnClick}>
            {t('buttons.EndTurn')}
          </button>
          <div className={styles.playersInfo}>
            <div className={playerTwoBlock}>
              <h3 className={styles.title}>
                {t('Player2')}
                :
              </h3>
              <h3 className={styles.playerTitle}>
                {' '}
                {players.player2.name}
              </h3>
            </div>
          </div>
        </div>
        {thisPlayer === 'player2' && (
          <>
            {gameMode !== 'tutorial' && (
              <button style={{ transform: type === 'combatLog' ? 'rotate(90deg)' : 'rotate(0)' }} type="button" onClick={handleBattleLogClick} className={styles.menuBtn}>
                <img src={CombatLogImg} alt="combat log" />
              </button>
            )}
            <button type="button" style={{ transform: isOpenMenu ? 'rotate(90deg)' : 'rotate(0)' }} onClick={handleMenuClick} className={styles.menuBtn}>
              <img src={Menu} alt="menu" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default BattleHeader;
