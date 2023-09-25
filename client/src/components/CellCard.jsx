import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import AttackIcon from '../assets/battlefield/Sword.png';
import Healed from '../assets/battlefield/Healing.svg';
import './CellCard.css';

const getTopMargin = (cardtype) => {
  if (cardtype === 'field') {
    return 5;
  }
  if (cardtype === 'hero') {
    return 6.5;
  }
  return 0;
};

const CellCard = ({
  item, type, setCardType, setContLength, setCardSource,
}) => {
  const {
    deleteCardfromSource,
    getActiveCard,
    handleAnimation,
    canBeAttacked,
    canBeCast,
    getWarriorPower,
  } = useContext(functionContext);
  const {
    makeFeatureCast,
    makeFeatureAttach,
    makeFight,
  } = useContext(abilityContext);
  const cardElement = useRef();
  const dispatch = useDispatch();
  const {
    cellId, turn,
  } = item;
  const { thisPlayer, fieldCells, playerPoints } = useSelector((state) => state.battleReducer);
  const currentCell = fieldCells.find((cell) => cell.id === cellId);
  const currentPoints = playerPoints.find((data) => data.player === thisPlayer).points;
  const marginTop = getTopMargin(type);
  const marginRight = type === 'bigSpell' ? 0.5 : 0;

  const cardStyles = cn({
    'cell-container__content-item': type !== 'hero',
    'cell-container__hero-cell-item': type === 'hero',
    'cell-container__makeattack-animation': currentCell.animation === 'makeattack',
    turn_1: turn === 1,
    turn_2: turn === 2,
  });

  const castSpell = async (spell, receiveCell) => {
    dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    const makeCast = async () => {
      await Promise.all(spell.features.map((feature) => new Promise((resolve) => {
        setTimeout(() => {
          if (!feature.condition && !feature.attach) {
            makeFeatureCast(feature, receiveCell);
            console.log('cast');
          } else if (feature.attach) {
            if (setCardType && setCardSource && setContLength) {
              setCardType('spell');
              setCardSource(spell.status);
              setContLength((prev) => prev + 1);
            }
            makeFeatureAttach(feature, receiveCell);
          }
          resolve();
        }, 500);
      })));
    };

    await makeCast();

    console.log('delete');

    if (spell.name !== 'fake' && spell.type !== 'hero') {
      deleteCardfromSource(spell);
      if (spell.subtype === 'instant') {
        dispatch(battleActions.addToGraveyard({ card: spell }));
      } else {
        dispatch(battleActions.addFieldContent({ activeCard: spell, id: receiveCell.id }));
      }
    }
    if (spell.type === 'hero') {
      dispatch(battleActions.turnCardLeft({
        cardId: spell.id,
        cellId: spell.cellId,
        qty: 1,
      }));
    }
  };

  const handleCardClick = () => {
    const activeCard = getActiveCard();
    const cardId = cardElement.current.id;
    const activeId = activeCard?.id ?? null;
    if (activeId === cardId) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
    } else if (canBeCast(cellId)) {
      if (activeCard.status === 'hand' || activeCard.type === 'hero') {
        const newPoints = currentPoints - activeCard.currentC;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      if (activeCard.type !== 'hero') {
        deleteCardfromSource(activeCard);
      }
      handleAnimation(activeCard, 'delete');
      castSpell(activeCard, currentCell);
    } else if (canBeAttacked(item)) {
      makeFight(activeCard, item);
    } else {
      handleAnimation(activeCard, 'delete');
      const currentCardData = currentCell.content.find((card) => card.id === cardId);
      dispatch(battleActions.addActiveCard({ card: currentCardData, player: thisPlayer }));
      handleAnimation(currentCardData, 'add');
    }
  };

  return (
    <button
      ref={cardElement}
      id={item.id}
      onClick={handleCardClick}
      key={item.id}
      type="button"
      data={item.player}
      className={cardStyles}
      style={{ marginTop: `-${marginTop}rem`, marginRight: `-${marginRight}rem` }}
    >
      {item.type === 'warrior' && (
        <>
          <h3 className="cell-container__warrior-power">{getWarriorPower(item)}</h3>
          <h3 className="cell-container__warrior-health">{item.currentHP}</h3>
        </>
      )}
      {item.type !== 'hero' && (
        <h3 className="cell-container__cost">{item.currentC}</h3>
      )}
      {item.type === 'hero' && (
        <h3 className="cell-container__hero-health">{item.currentHP}</h3>
      )}
      <img
        className="cell-container__image"
        src={item.img}
        alt={item.name}
      />
      {currentCell.animation === 'attacked' && (
        <img
          className="cell-container__attack-icon"
          src={AttackIcon}
          alt="attack icon"
        />
      )}
      {currentCell.animation === 'healed' && (
        <img
          className="cell-container__heal-icon"
          src={Healed}
          alt="heal icon"
        />
      )}

    </button>
  );
};

export default CellCard;
