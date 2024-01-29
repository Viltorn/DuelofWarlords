import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import AttackIcon from '@assets/battlefield/Sword.png';
import Healed from '@assets/battlefield/Healing.svg';
import { actions as battleActions } from '../../../slices/battleSlice.js';
import functionContext from '../../../contexts/functionsContext.js';
import abilityContext from '../../../contexts/abilityActions.js';
import styles from './CellCard.module.css';

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
  item, type,
}) => {
  const {
    getActiveCard,
    addActiveCard,
    handleAnimation,
    getWarriorPower,
    canBeCast,
    canBeAttacked,
    toogleInfoWindow,
  } = useContext(functionContext);
  const {
    actionPerforming,
    makeGameAction,
    invoking,
  } = useContext(abilityContext);
  const cardElement = useRef();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {
    cellId, turn, faction, description, school, currentHP, currentC,
  } = item;
  const cardsFeature = faction ?? school;
  const { thisPlayer, fieldCells, playerPoints } = useSelector((state) => state.battleReducer);
  const { curRoom, gameMode } = useSelector((state) => state.gameReducer);
  const currentCell = fieldCells.find((cell) => cell.id === cellId);
  const currentPoints = playerPoints.find((data) => data.player === thisPlayer).points;
  const power = item.type === 'warrior' ? getWarriorPower(item) : null;
  const marginTop = getTopMargin(type);
  const marginRight = type === 'bigSpell' ? 0.5 : 0;

  const cardStyles = cn({
    [styles.contentItem]: type !== 'hero',
    [styles.heroCellItem]: type === 'hero',
    [styles.makeAttackAnimation]: currentCell.animation === 'makeattack',
    [styles.turn1]: turn === 1,
    [styles.turn2]: turn === 2,
  });

  const titleClasses = cn({
    [styles.cardName]: type !== 'hero',
    [styles.heroName]: type === 'hero',
  });

  const makeCardAction = (card, player, points, cell, appliedCard) => {
    if (canBeCast(cell.id)) {
      handleAnimation(card, 'delete');
      const data = {
        move: 'castSpell',
        room: curRoom,
        card,
        player,
        points,
        cell,
      };
      makeGameAction(data, gameMode);
    } else if (canBeAttacked(appliedCard)) {
      const data = {
        move: 'makeFight',
        room: curRoom,
        card1: card,
        card2: appliedCard,
      };
      makeGameAction(data, gameMode);
    } else {
      handleAnimation(card, 'delete');
      toogleInfoWindow(false);
      addActiveCard(appliedCard, player);
      handleAnimation(appliedCard, 'add');
    }
  };

  const handleCardClick = () => {
    if (invoking) {
      return;
    }
    if (gameMode === 'online' && actionPerforming) {
      return;
    }
    const activeCard = getActiveCard();
    const cardId = cardElement.current.id;
    const activeId = activeCard?.id ?? null;
    if (activeId === cardId) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
      toogleInfoWindow(false);
    } else {
      makeCardAction(activeCard, thisPlayer, currentPoints, currentCell, item);
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
      <h2 className={titleClasses}>{t(`titles.${cardsFeature}.${description}`)}</h2>
      {item.type === 'warrior' && (
        <>
          <h3 className={styles.warriorPower}>{power}</h3>
          <h3 className={styles.warriorHealth}>{currentHP}</h3>
        </>
      )}
      {item.type !== 'hero' && (
        <h3 className={styles.cost}>{currentC}</h3>
      )}
      {item.type === 'hero' && (
        <h3 className={styles.heroHealth}>{currentHP}</h3>
      )}
      <img
        className={styles.image}
        src={item.img}
        alt={item.name}
      />
      {currentCell.animation === 'attacked' && (
        <img
          className={styles.attackIcon}
          src={AttackIcon}
          alt="attack icon"
        />
      )}
      {currentCell.animation === 'healed' && (
        <img
          className={styles.healIcon}
          src={Healed}
          alt="heal icon"
        />
      )}

    </button>
  );
};

export default CellCard;
