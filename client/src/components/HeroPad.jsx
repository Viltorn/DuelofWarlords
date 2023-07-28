import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch, useStore } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';

const HeroPad = ({ type, player }) => {
  const { t } = useTranslation();
  const store = useStore();
  const dispatch = useDispatch();
  const { fieldCells } = useSelector((state) => state.battleReducer);
  const hero1Data = fieldCells.find((cell) => cell.id === 'hero1').content[0];
  const hero2Data = fieldCells.find((cell) => cell.id === 'hero2').content[0];
  const classesContainer = cn({
    'hero-container-1': type === 'first',
    'hero-container-2': type === 'second',
  });

  const hero1CardClasses = cn({
    'cell-hero-pad': true,
    turn_1: hero1Data.turn === 1,
    turn_2: hero1Data.turn === 2,
  });

  const hero2CardClasses = cn({
    'cell-hero-pad': true,
    turn_1: hero2Data.turn === 1,
    turn_2: hero2Data.turn === 2,
  });

  const handleHero1Click = () => {
    const { activeCardPlayer1, activeCardPlayer2, thisPlayer } = store.getState().battleReducer;
    const activeCard = thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
    if (!activeCard) {
      dispatch(battleActions.addActiveCard({ card: hero1Data, player: thisPlayer }));
    } else if (activeCard.id === hero1Data.id) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    }
  };

  const handleHero2Click = () => {
    const { activeCardPlayer1, activeCardPlayer2, thisPlayer } = store.getState().battleReducer;
    const activeCard = thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
    if (!activeCard) {
      dispatch(battleActions.addActiveCard({ card: hero2Data, player: thisPlayer }));
    } else if (activeCard.id === hero2Data.id) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    }
  };

  return (
    <div className={classesContainer}>
      {type === 'second' && (
        <div className="cell-hero-pad">
          <h3 className="default-cell-font">Hand</h3>
        </div>
      )}
      {type === 'first' && player === 'player1' && (
        <>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Deck')}</h3>
          </div>
          <button className={hero1CardClasses} type="button" onClick={handleHero1Click}>
            <h3 className="cell-hero-pad__hero-health">{hero1Data.currentHP}</h3>
            <img className="cell-container__image" src={hero1Data.img} alt={hero1Data.name} />
          </button>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Graveyard')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('PostponedSpell')}</h3>
          </div>
        </>
      )}
      {type === 'first' && player === 'player2' && (
        <>
          <button className={hero2CardClasses} type="button" onClick={handleHero2Click}>
            <h3 className="cell-hero-pad__hero-health">{hero2Data.currentHP}</h3>
            <img className="cell-container__image" src={hero2Data.img} alt={hero2Data.name} />
          </button>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Deck')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('PostponedSpell')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Graveyard')}</h3>
          </div>
        </>
      )}
      {type === 'second' && (
        <>
          {player === 'player1' ? (
            <button className={hero2CardClasses} type="button" onClick={handleHero2Click}>
              <h3 className="cell-hero-pad__hero-health">{hero2Data.currentHP}</h3>
              <img className="cell-container__image" src={hero2Data.img} alt={hero2Data.name} />
            </button>
          ) : (
            <button className={hero1CardClasses} type="button" onClick={handleHero1Click}>
              <h3 className="cell-hero-pad__hero-health">{hero1Data.currentHP}</h3>
              <img className="cell-container__image" src={hero1Data.img} alt={hero1Data.name} />
            </button>
          )}
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('PostponedSpell')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Deck')}</h3>
          </div>
          <div className="cell-hero-pad">
            <h3 className="default-cell-font">{t('Graveyard')}</h3>
          </div>
        </>
      )}
    </div>
  );
};

export default HeroPad;
