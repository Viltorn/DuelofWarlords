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
import './HeroPad.css';

const HeroPad = ({ type, player }) => {
  const { t } = useTranslation();
  const deck = useRef();
  const dispatch = useDispatch();
  const {
    deleteCardfromSource, getActiveCard, handleAnimation, isAllowedCost, changeTutorStep,
  } = useContext(functionContext);

  const { makeFeatureAttach } = useContext(abilityContext);

  const {
    fieldCells, playersHands, thisPlayer, playerPoints, commonPoints, players,
  } = useSelector((state) => state.battleReducer);
  const { gameMode } = useSelector((state) => state.gameReducer);

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
    'hero-pad_1': type === 'first',
    'hero-pad_2': type === 'second',
  });

  const cellsClasses = cn({
    'hero-pad__cells': true,
    'second-type': type === 'second',
    'second-player': type === 'first' && player === 'player2',
  });

  const postPonedAnima = cn({
    'hero-pad___animation_green': postponedCell.animation === 'green',
  });

  const heroAnima = cn({
    'hero-pad___animation_green': heroCell.animation === 'green',
    'hero-pad___animation_red': heroCell.animation === 'red',
  });

  const addPosponedCard = () => {
    const activeCard = getActiveCard();

    if (activeCard && !isAllowedCost(activeCard)) {
      return;
    }

    if (activeCard && player === activeCard.player) {
      if (gameMode === 'tutorial') {
        changeTutorStep((prev) => prev + 1);
      }
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.cost;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      handleAnimation(activeCard, 'delete');
      dispatch(battleActions.addFieldContent({ activeCard, id: postponedCell.id }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      if (activeCard.type === 'spell' && activeCard.place === 'postponed') {
        activeCard.features.forEach((feature) => makeFeatureAttach(feature, postponedCell));
      }
    }
  };

  const handlePostCardClick = () => {
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
    const deckOwner = deck.current.dataset.player;
    const firstRound = commonPoints === 1;
    const drawStatus = players[thisPlayer].cardsdrawn;
    if ((deckOwner === thisPlayer && firstRound && !drawStatus && gameMode !== 'tutorial') || gameMode === 'hotseat') {
      dispatch(modalsActions.openModal({ type: 'drawCards', player: thisPlayer }));
    }
  };

  const checkGraveyard = () => {
    if (!graveCell.disabled) {
      dispatch(modalsActions.openModal({ type: 'openGraveyard', player }));
    }
  };

  return (
    <div className={classesContainer}>
      {type === 'second' && (
        <div className="hero-pad__cells hero-pad__cells_no-border">
          <h3 className="hero-pad__cards-count">{cardsCount}</h3>
          <img className="hero-pad__image  hero-pad__image_no-border" src={CardCounter} alt="cards counter" />
        </div>
      )}
      <div className={`${cellsClasses} hero-pad__cells_no-border`}>
        <button className="hero-pad__default-btn" ref={deck} data-player={player} type="button" onClick={handleDeckClick}>
          <img className="hero-pad__image hero-pad__image_no-border" src={DeckCover} alt="deck cover" />
        </button>
      </div>
      <div className={`${cellsClasses} ${heroAnima} hero-pad__cells_no-border`}>
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
          <CSSTransition timeout={500} classNames="cardanimation">
            <button className="hero-pad__default-btn" type="button" onClick={checkGraveyard}>
              <img className="hero-pad__image" src={lastItem.img} alt={lastItem.name} />
            </button>
          </CSSTransition>
          )}
        </TransitionGroup>
        {graveyardContent.length === 0 && (
          <button className="hero-pad__default-btn" onClick={checkGraveyard} type="button">
            <h3 className="hero-pad__default-title">{t('Graveyard')}</h3>
          </button>
        )}
      </div>
      <div className={`${cellsClasses} ${postPonedAnima}`}>
        <TransitionGroup component={null}>
          {postponedCell.content.length !== 0 && (
            <CSSTransition timeout={500} classNames="cardanimation">
              <button className="hero-pad__default-btn hero-pad__posponed_active" id={postponedCell.id} onClick={handlePostCardClick} type="button">
                {postponedCell.status === 'face' ? (
                  <img className="hero-pad__image" src={postponedContentData.img} alt={postponedContentData.name} />
                ) : (
                  <img className="hero-pad__image" src={CardCover} alt="cards cover" />
                )}
              </button>
            </CSSTransition>
          )}
        </TransitionGroup>
        {postponedCell.content.length === 0 && (
        <button className="hero-pad__default-btn" id={postponedCell.id} onClick={addPosponedCard} type="button">
          <h3 className="hero-pad__default-title">{t('PostponedSpell')}</h3>
        </button>
        )}
      </div>
    </div>
  );
};

export default HeroPad;
