/* eslint-disable max-len */
import React, { useContext, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import CardCover from '@assets/battlefield/CardCover.png';
import DeckCover from '@assets/battlefield/DeckCover.png';
import CardCounter from '@assets/battlefield/CardCounter.png';
import { actions as modalsActions } from '../../../slices/modalsSlice.js';
import { actions as battleActions } from '../../../slices/battleSlice.js';
import functionContext from '../../../contexts/functionsContext.js';
import CellCard from '../CellCard/CellCard.jsx';
import styles from './HeroPad.module.css';

const HeroPad = ({ type, player }) => {
  const { t } = useTranslation();
  const deck = useRef();
  const dispatch = useDispatch();
  const {
    getActiveCard, handleAnimation, isAllowedCost, actionPerforming, makeGameAction,
  } = useContext(functionContext);

  const {
    fieldCells, fieldCards, playersHands, thisPlayer, playerPoints, commonPoints, players, gameTurn,
  } = useSelector((state) => state.battleReducer);
  const { gameMode, curRoom } = useSelector((state) => state.gameReducer);

  const currentPoints = playerPoints.find((data) => data.player === thisPlayer).points;

  const postponedCell1 = useMemo(() => fieldCells.find((cell) => cell.id === 'postponed1'), [fieldCells]);
  const postponedCell2 = useMemo(() => fieldCells.find((cell) => cell.id === 'postponed2'), [fieldCells]);
  const postponedCell = useMemo(() => (player === 'player1' ? postponedCell1 : postponedCell2), [postponedCell1, postponedCell2, player]);
  const cardsCount = useMemo(() => (thisPlayer === 'player1' ? playersHands.player2.length : playersHands.player1.length), [thisPlayer,
    playersHands]);
  const postponedCellId = useMemo(() => (player === 'player1' ? 'postponed1' : 'postponed2'), [player]);
  const postponedContentData = useMemo(() => fieldCards.find((card) => card.cellId === postponedCellId), [postponedCellId, fieldCards]);
  const heroCellId = useMemo(() => (player === 'player1' ? 'hero1' : 'hero2'), [player]);
  const heroCell = useMemo(() => fieldCells.find((cell) => cell.player === player && cell.type === 'hero'), [fieldCells, player]);
  const heroData = useMemo(() => fieldCards.filter((card) => card.cellId === heroCellId), [heroCellId, fieldCards]);
  const graveCellId = useMemo(() => fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard').id, [fieldCells, player]);
  const graveyardContent = useMemo(() => fieldCards.filter((card) => card.cellId === graveCellId), [graveCellId, fieldCards]);
  const lastItem = useMemo(() => graveyardContent[0], [graveyardContent]);

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
    if ((activeCard && !isAllowedCost(activeCard, currentPoints)) || postponedCell.disabled) {
      return;
    }

    if (activeCard && player === activeCard.player) {
      const data = {
        move: 'addCardToField', room: curRoom, card: activeCard, player, points: currentPoints, curCell: postponedCell, field: fieldCells,
      };
      makeGameAction(data, gameMode);
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
    if (gameTurn !== thisPlayer) {
      return;
    }
    const deckOwner = deck.current.dataset.player;
    const firstRound = commonPoints === 1;
    const drawStatus = players[thisPlayer].cardsdrawn;
    if (deckOwner === thisPlayer && firstRound && !drawStatus && gameMode !== 'tutorial') {
      dispatch(modalsActions.openModal({ type: 'drawCards', player: thisPlayer, roomId: curRoom }));
    }
    if (gameMode === 'hotseat' && !firstRound) {
      dispatch(modalsActions.openModal({ type: 'openGraveyard', player, data: 'deck' }));
    }
  };

  const checkGraveyard = () => {
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    dispatch(modalsActions.openModal({ type: 'openGraveyard', player, data: 'grave' }));
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
          {postponedContentData && (
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
        {!postponedContentData && (
        <button className={styles.defaultBtn} id={postponedCell.id} onClick={addPosponedCard} type="button">
          <h3 className={styles.defaultTitle}>{t('PostponedSpell')}</h3>
        </button>
        )}
      </div>
    </div>
  );
};

export default HeroPad;
