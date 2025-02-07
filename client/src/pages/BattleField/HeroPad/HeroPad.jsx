/* eslint-disable max-len */
import React, { useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import DeckCover from '@assets/battlefield/DeckCover.png';
import CardCounter from '@assets/battlefield/CardCounter.png';
import getEnemyPlayer from '../../../utils/supportFunc/getEnemyPlayer.js';
import Timer from '../../../components/Timer/Timer.jsx';
import isWarriorReady from '../../../utils/supportFunc/isWarriorReady.js';
import CellCard from '../CellCard/CellCard.jsx';
import styles from './HeroPad.module.css';
import useClickActions from '../../../hooks/useClickActions.js';

const cardsToShowHeroSlot = 5;

const HeroPad = ({ type, player }) => {
  const { t } = useTranslation();
  const deck = useRef();

  const { handleDeckClick, handlePointsClick, handleGraveyardClick } = useClickActions();

  const {
    fieldCells, fieldCards, playersHands, thisPlayer, playerPoints, gameTurn, playersDecks,
  } = useSelector((state) => state.battleReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);
  const { timer } = useSelector((state) => state.uiReducer);

  const curPoints = playerPoints.find((data) => data.player === player).points;
  const { maxPoints } = playerPoints.find((data) => data.player === player);

  const cardsCount = useMemo(() => playersHands[getEnemyPlayer(thisPlayer)].length, [thisPlayer, playersHands]);
  const counterCell = useMemo(() => fieldCells.find((cell) => cell.player === player && cell.type === 'counter'), [fieldCells, player]);
  const cardsInDecks = useMemo(() => playersDecks[player].length, [playersDecks, player]);
  const heroCellId = useMemo(() => (player === 'player1' ? 'hero1' : 'hero2'), [player]);
  const heroCell = useMemo(() => fieldCells.find((cell) => cell.player === player && cell.type === 'hero'), [fieldCells, player]);
  const heroData = useMemo(() => fieldCards.filter((card) => card.cellId === heroCellId), [heroCellId, fieldCards]);
  const graveCell = useMemo(() => fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard'), [fieldCells, player]);
  const graveCellId = graveCell.id;
  const graveyardContent = useMemo(() => fieldCards.filter((card) => card.cellId === graveCellId), [graveCellId, fieldCards]);
  const lastItem = useMemo(() => graveyardContent[0], [graveyardContent]);
  const heroCard = heroData.find((card) => card.type === 'hero');
  const readyWarrior = useMemo(() => isWarriorReady(heroCard, player, gameTurn) && heroCard.features.find((feat) => feat.cost <= curPoints), [gameTurn, heroCard, curPoints, player]);

  const lastCardToShowIdx = heroData.length + 1 - cardsToShowHeroSlot;
  const heroCellContent = heroData
    .slice(lastCardToShowIdx > 0 ? lastCardToShowIdx : 0);

  const classesContainer = cn({
    [styles.heroPad1]: type === 'first',
    [styles.heroPad2]: type === 'second',
    [styles.onlineMargin]: type === 'first' && timer,
  });

  const cellsClasses = cn({
    [styles.cells]: true,
    [styles.secondType]: type === 'second',
    [styles.secondPlayer]: type === 'first' && player === 'player2',
  });

  const counterClasses = cn({
    [styles.counterCell]: true,
    [styles.noBorder]: true,
    [styles.animationGreen]: counterCell.animation === 'green',
    [styles.secondType]: type === 'second',
    [styles.secondPlayer]: type === 'first' && player === 'player2',
  });

  const heroAnima = cn({
    [styles.animationGreen]: heroCell.animation === 'green',
    [styles.animationRed]: heroCell.animation === 'red',
    [styles.heroCanAct]: heroCell.animation === '' && readyWarrior && !heroCell.disabled,
  });

  const graveCellClasses = cn({
    [styles.defaultBtn]: true,
    [styles.animationGreen]: graveCell.animation === 'green',
    [styles.animationRed]: graveCell.animation === 'red',
  });

  return (
    <div className={styles.padContainer}>
      {timer && type === 'first' && (<Timer gameTurn={gameTurn} thisPlayer={thisPlayer} />)}
      <div className={classesContainer}>

        {type === 'second' && (
        <div className={`${styles.cells} ${styles.noBorder}`}>
          <h3 className={styles.cardsCount}>{cardsCount}</h3>
          <img className={`${styles.image} ${styles.noBorder}`} src={CardCounter} alt="cards counter" />
        </div>
        )}
        {cardsInDecks > 0
          ? (
            <div className={`${cellsClasses} ${styles.noBorder}`}>
              <button className={styles.defaultBtn} ref={deck} data-player={player} type="button" onClick={() => handleDeckClick({ deck, player })}>
                <img className={`${styles.image} ${styles.noBorder}`} src={DeckCover} alt="deck cover" />
              </button>
            </div>
          )
          : (
            <div className={`${cellsClasses}`}>
              <button className={styles.defaultBtn} onClick={() => handleDeckClick({ deck, player })} type="button">
                <h3 className={styles.defaultTitle}>{t('Deck')}</h3>
              </button>
            </div>
          )}
        <div className={`${cellsClasses} ${heroAnima} ${styles.noBorder}`}>
          {heroCellContent.length > 0 && (
            heroCellContent.map((item) => (
              <CellCard
                key={item.id}
                item={item}
                cellType="hero"
                content={heroCellContent}
              />
            ))
          )}
        </div>
        <div className={cellsClasses}>
          <TransitionGroup component={null}>
            {graveyardContent.length !== 0 && (
            <CSSTransition
              timeout={500}
              classNames={{
                enter: styles.cardAnimationEnter,
                enterActive: styles.cardAnimationActive,
                exit: styles.cardAnimationExit,
                exitActive: styles.cardAnimationExitActive,
              }}
            >
              <button className={graveCellClasses} type="button" onClick={() => handleGraveyardClick(player, graveCell)}>
                <img className={styles.image} src={lastItem.img} alt={lastItem.name} />
              </button>
            </CSSTransition>
            )}
          </TransitionGroup>
          {graveyardContent.length === 0 && (
          <button className={graveCellClasses} onClick={() => handleGraveyardClick(player, graveCell)} type="button">
            <h3 className={styles.defaultTitle}>{t('Graveyard')}</h3>
          </button>
          )}
        </div>
        <div className={counterClasses}>
          <button type="button" onClick={() => handlePointsClick(thisPlayer)} disabled={gameMode !== 'test'} className={styles.counter}>
            <h3 className={styles.counterNum}>{curPoints}</h3>
            <span className={styles.counterNum}>/</span>
            <h3 className={styles.counterNum}>{maxPoints}</h3>
          </button>
        </div>
      </div>
    </div>
  );
};

export default HeroPad;
