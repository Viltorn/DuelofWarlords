/* eslint-disable max-len */
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import Menu from '@assets/Menu.svg';
import MusicButton from '../../../components/Buttons/MusicButton/MusicButton.jsx';
import useClickActions from '../../../hooks/useClickActions.js';
import tutorialStepsData from '../../../gameData/tutorialStepsData.js';
import useFunctionsContext from '../../../hooks/useFunctionsContext.js';
import styles from './BattleHeader.module.css';
import useBattleActions from '../../../hooks/useBattleActions.js';

const BattleHeader = () => {
  const { t } = useTranslation();

  const {
    hadleEndTurnClick,
    handleMenuClick,
  } = useClickActions();

  const { gameMode } = useSelector((state) => state.gameReducer);
  const {
    thisPlayer,
    players,
    gameTurn,
  } = useSelector((state) => state.battleReducer);
  const {
    isOpenMenu,
  } = useFunctionsContext();
  const { tutorStep } = useBattleActions();
  const { disEndTurn } = tutorialStepsData[tutorStep];

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
            <MusicButton />
          </>
        )}
        <div className={styles.infoContainer}>
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
            {/* <button type="button" onClick={() => handlePointsClick('player1')} disabled={gameMode !== 'hotseat'} className={styles.counter}>
            <h3 className={styles.counterNum}>{player1Points}</h3>
          </button> */}
          </div>
          <button className={styles.endturnBtn} type="button" disabled={disEndTurn && gameMode === 'tutorial'} onClick={hadleEndTurnClick}>
            {t('EndTurn')}
          </button>
          <div className={styles.playersInfo}>
            {/* <button type="button" onClick={() => handlePointsClick('player2')} disabled={gameMode !== 'hotseat'} className={styles.counter}>
            <h3 className={styles.counterNum}>{player2Points}</h3>
          </button> */}
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
        </div>
        {thisPlayer === 'player2' && (
          <>
            <MusicButton />
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
