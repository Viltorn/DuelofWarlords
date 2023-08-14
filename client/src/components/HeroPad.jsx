/* eslint-disable max-len */
import React, { useContext, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import { actions as modalsActions } from '../slices/modalsSlice.js';
import CardCover from '../assets/battlefield/CardCover.png';
import DeckCover from '../assets/battlefield/DeckCover.png';
import CardCounter from '../assets/battlefield/CardCounter.png';
import functionContext from '../contexts/functionsContext.js';
import './HeroPad.css';

const HeroPad = ({ type, player }) => {
  const { t } = useTranslation();
  const deck = useRef();
  const dispatch = useDispatch();
  const { deleteCardfromSource, getActiveCard } = useContext(functionContext);
  const {
    fieldCells, playerOneHand, playerTwoHand, thisPlayer,
  } = useSelector((state) => state.battleReducer);

  const hero1Cell = fieldCells.find((cell) => cell.id === 'hero1');
  const hero1Data = hero1Cell.content[0];
  const hero2Cell = fieldCells.find((cell) => cell.id === 'hero2');
  const hero2Data = hero2Cell.content[0];
  const postponedCell1 = fieldCells.find((cell) => cell.id === 'postponed1');
  const postponed1data = postponedCell1.content[0];
  const postponedCell2 = fieldCells.find((cell) => cell.id === 'postponed2');
  const postponed2data = postponedCell2.content[0];
  const cardsCount = thisPlayer === 'player1' ? playerTwoHand.length : playerOneHand.length;
  const postponedCell = player === 'player1' ? postponedCell1 : postponedCell2;
  const postponedContentData = player === 'player1' ? postponed1data : postponed2data;
  const heroData = player === 'player1' ? hero1Data : hero2Data;
  const graveyardContent = fieldCells.find((cell) => cell.player === player && cell.type === 'graveyard').content;
  const lastItem = graveyardContent[0];

  const classesContainer = cn({
    'hero-pad_1': type === 'first',
    'hero-pad_2': type === 'second',
  });

  const heroCardClasses = cn({
    'hero-pad__default-btn': true,
    turn_1: heroData?.turn === 1,
    turn_2: heroData?.turn === 2,
  });

  const cellsClasses = cn({
    'hero-pad__cells': true,
    'second-type': type === 'second',
    'second-player': type === 'first' && player === 'player2',
  });

  const handleHeroClick = () => {
    const activeCard = getActiveCard();
    if (!activeCard) {
      dispatch(battleActions.addActiveCard({ card: heroData, player: thisPlayer }));
    } else if (activeCard.id === heroData.id) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    }
  };

  const addPosponedCard = () => {
    const activeCard = getActiveCard();
    if (activeCard && player === activeCard.player) {
      dispatch(battleActions.addFieldContent({ activeCard, id: postponedCell.id }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    }
  };

  const handlePostCardClick = () => {
    const activeCard = getActiveCard();
    if (!activeCard && ((postponedCell.status === 'cover' && player === thisPlayer) || (postponedCell.status === 'face'))) {
      dispatch(battleActions.addActiveCard({ card: postponedContentData, player: thisPlayer }));
    } else if (activeCard && activeCard.id === postponedContentData.id) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    }
  };

  const handleDeckClick = () => {
    const activeCard = getActiveCard();
    const deckOwner = deck.current.dataset.player;
    console.log(deckOwner);
    if (activeCard && player === activeCard.player) {
      dispatch(battleActions.sendCardtoDeck({ activeCard }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    } else if (deckOwner === thisPlayer) {
      dispatch(battleActions.drawCard({ player: thisPlayer }));
    }
  };

  const checkGraveyard = () => {
    dispatch(modalsActions.openModal({ type: 'openGraveyard', player }));
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
      <div className={`${cellsClasses} hero-pad__cells_no-border`}>
        <button className={heroCardClasses} type="button" onClick={handleHeroClick}>
          <h3 className="hero-pad__hero-health">{heroData?.currentHP}</h3>
          <img className="hero-pad__image" src={heroData?.img} alt={heroData?.name} />
        </button>
      </div>
      <div className={cellsClasses}>
        {graveyardContent.length !== 0 ? (
          <button className="hero-pad__default-btn" type="button" onClick={checkGraveyard}>
            <img className="hero-pad__image" src={lastItem.img} alt={lastItem.name} />
          </button>
        ) : (
          <button className="hero-pad__default-btn" onClick={checkGraveyard} type="button">
            <h3 className="hero-pad__default-title">{t('Graveyard')}</h3>
          </button>
        )}
      </div>
      <div className={cellsClasses}>
        {postponedCell.content.length !== 0 ? (
          <button className="hero-pad__default-btn" id={postponedCell.id} onClick={handlePostCardClick} type="button">
            {postponedCell.status === 'face' ? (
              <img className="hero-pad__image" src={postponedContentData.img} alt={postponedContentData.name} />
            ) : (
              <img className="hero-pad__image" src={CardCover} alt="cards cover" />
            )}
          </button>
        ) : (
          <button className="hero-pad__default-btn" id={postponedCell.id} onClick={addPosponedCard} type="button">
            <h3 className="hero-pad__default-title">{t('PostponedSpell')}</h3>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroPad;
