/* eslint-disable max-len */
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import CardCover from '../assets/battlefield/CardCover.png';
import DeckCover from '../assets/battlefield/DeckCover.png';
import CardCounter from '../assets/battlefield/CardCounter.png';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import CellCard from './CellCard.jsx';
import styles from './HeroPad.module.css';

const HeroPad = ({ type, player }) => {
  const { t } = useTranslation();
  const deck = useRef();
  const dispatch = useDispatch();
  const {
    getActiveCard, handleAnimation, isAllowedCost,
  } = useContext(functionContext);

  const { addCardToField, actionPerforming, makeOnlineAction } = useContext(abilityContext);

  const {
    fieldCells, playersHands, thisPlayer, playerPoints, commonPoints, players,
  } = useSelector((state) => state.battleReducer);
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);

  const currentPoints = playerPoints.find((data) => data.player === thisPlayer).points;

  const hero1Cell = fieldCells.find((cell) => cell.id === 'hero1');
  const hero2Cell = fieldCells.find((cell) => cell.id === 'hero2');
  const postponedCell1 = fieldCells.find((cell) => cell.id === 'postponed1');
  const postponedCell2 = fieldCells.find((cell) => cell.id === 'postponed2');
  const cardsCount = thisPlayer === 'player1' ? playersHands.player2.length : playersHands.player1.length;
  const postponedCell = player === 'player1' ? postponedCell1 : postponedCell2;
  const postponedContentData = postponedCell.content[0];
  const heroCell = player === 'player1' ? hero1Cell : hero2Cell;
  const heroData = heroCell.content;
  const graveCell = fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard');
  const graveyardContent = graveCell.content;
  const lastItem = graveyardContent[0];

  const classesContainer = cn({
    [styles.heroPad1]: type === 'first',
    [styles.heroPad2]: type === 'second',
  });

  const cellsClasses = cn({
    [styles.cells]: true,
    [styles.secondType]: type === 'second',
    [styles.secondPlayer]: type === 'first' && player === 'player2',
  });

  const postPonedAnima = cn({
    [styles.animationGreen]: postponedCell.animation === 'green',
  });

  const heroAnima = cn({
    [styles.animationGreen]: heroCell.animation === 'green',
    [styles.animationRed]: heroCell.animation === 'red',
  });

  const addPosponedCard = () => {
    const activeCard = getActiveCard();

    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    if (activeCard && !isAllowedCost(activeCard)) {
      return;
    }

    if (activeCard && player === activeCard.player) {
      const data = {
        move: 'addCardToField', room: curRoom, card: activeCard, player, points: currentPoints, curCell: postponedCell,
      };
      if (gameMode === 'online') {
        makeOnlineAction(data);
      } else {
        addCardToField(data);
      }
    }
  };

  const handlePostCardClick = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    const activeCard = getActiveCard();
    if (!activeCard && (postponedCell.status === 'cover' && player === thisPlayer)) {
      dispatch(battleActions.addActiveCard({ card: postponedContentData, player: thisPlayer }));
    }
    if (!activeCard && postponedCell.status === 'face') {
      dispatch(battleActions.addActiveCard({ card: postponedContentData, player: thisPlayer }));
      handleAnimation(postponedContentData, 'add');
    } else if (activeCard && activeCard.id === postponedContentData.id) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
    }
  };

  const handleDeckClick = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    const deckOwner = deck.current.dataset.player;
    const firstRound = commonPoints === 1;
    const drawStatus = players[thisPlayer].cardsdrawn;
    if ((deckOwner === thisPlayer && firstRound && !drawStatus && gameMode !== 'tutorial') || gameMode === 'hotseat') {
      dispatch(modalsActions.openModal({ type: 'drawCards', player: thisPlayer, roomId: curRoom }));
    }
  };

  const checkGraveyard = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    if (!graveCell.disabled) {
      dispatch(modalsActions.openModal({ type: 'openGraveyard', player }));
    }
  };

  return (
    <div className={classesContainer}>
      {type === 'second' && (
        <div className={`${styles.cells} ${styles.noBorder}`}>
          <h3 className={styles.cardsCount}>{cardsCount}</h3>
          <img className={`${styles.image} ${styles.noBorder}`} src={CardCounter} alt="cards counter" />
        </div>
      )}
      <div className={`${cellsClasses} ${styles.noBorder}`}>
        <button className={styles.defaultBtn} ref={deck} data-player={player} type="button" onClick={handleDeckClick}>
          <img className={`${styles.image} ${styles.noBorder}`} src={DeckCover} alt="deck cover" />
        </button>
      </div>
      <div className={`${cellsClasses} ${heroAnima} ${styles.noBorder}`}>
        {heroData.length > 0 && (
          heroData.map((item) => (
            <CellCard
              key={item.id}
              item={item}
              type="hero"
              content={heroData}
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
            <button className={styles.defaultBtn} type="button" onClick={checkGraveyard}>
              <img className={styles.image} src={lastItem.img} alt={lastItem.name} />
            </button>
          </CSSTransition>
          )}
        </TransitionGroup>
        {graveyardContent.length === 0 && (
          <button className={styles.defaultBtn} onClick={checkGraveyard} type="button">
            <h3 className={styles.defaultTitle}>{t('Graveyard')}</h3>
          </button>
        )}
      </div>
      <div className={`${cellsClasses} ${postPonedAnima}`}>
        <TransitionGroup component={null}>
          {postponedCell.content.length !== 0 && (
            <CSSTransition
              timeout={500}
              classNames={{
                enter: styles.cardAnimationEnter,
                enterActive: styles.cardAnimationActive,
                exit: styles.cardAnimationExit,
                exitActive: styles.cardAnimationExitActive,
              }}
            >
              <button className={`${styles.defaultBtn} ${styles.posponedActive}`} id={postponedCell.id} onClick={handlePostCardClick} type="button">
                {postponedCell.status === 'face' ? (
                  <img className={styles.image} src={postponedContentData.img} alt={postponedContentData.name} />
                ) : (
                  <img className={styles.image} src={CardCover} alt="cards cover" />
                )}
              </button>
            </CSSTransition>
          )}
        </TransitionGroup>
        {postponedCell.content.length === 0 && (
        <button className={styles.defaultBtn} id={postponedCell.id} onClick={addPosponedCard} type="button">
          <h3 className={styles.defaultTitle}>{t('PostponedSpell')}</h3>
        </button>
        )}
      </div>
    </div>
  );
};

export default HeroPad;
