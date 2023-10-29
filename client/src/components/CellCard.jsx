import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import AttackIcon from '../assets/battlefield/Sword.png';
import Healed from '../assets/battlefield/Healing.svg';
import styles from './CellCard.module.css';
import socket from '../socket.js';

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
  } = useContext(functionContext);
  const {
    castSpell,
    makeFight,
  } = useContext(abilityContext);
  const cardElement = useRef();
  const dispatch = useDispatch();
  const {
    cellId, turn,
  } = item;
  const { thisPlayer, fieldCells, playerPoints } = useSelector((state) => state.battleReducer);
  const { curRoom, gameMode } = useSelector((state) => state.gameReducer);
  const currentCell = fieldCells.find((cell) => cell.id === cellId);
  const currentPoints = playerPoints.find((data) => data.player === thisPlayer).points;
  const marginTop = getTopMargin(type);
  const marginRight = type === 'bigSpell' ? 0.5 : 0;

  const cardStyles = cn({
    [styles.contentItem]: type !== 'hero',
    [styles.heroCellItem]: type === 'hero',
    [styles.makeAttackAnimation]: currentCell.animation === 'makeattack',
    [styles.turn1]: turn === 1,
    [styles.turn2]: turn === 2,
  });

  const makeCardAction = (card, player, points, cell, appliedCard) => {
    if (canBeCast(cell.id)) {
      handleAnimation(card, 'delete');
      if (gameMode === 'online') {
        socket.emit('makeMove', {
          move: 'castSpell',
          room: curRoom,
          card,
          player,
          points,
          cell,
        });
      }
      castSpell(card, player, points, cell);
    } else if (canBeAttacked(appliedCard)) {
      if (gameMode === 'online') {
        socket.emit('makeMove', {
          move: 'makeFight',
          room: curRoom,
          card1: card,
          card2: appliedCard,
        });
      }
      makeFight(card, appliedCard);
    } else {
      handleAnimation(card, 'delete');
      const currentCardData = cell.content.find((el) => el.id === appliedCard.id);
      addActiveCard(currentCardData, player);
      handleAnimation(currentCardData, 'add');
    }
  };

  const handleCardClick = () => {
    const activeCard = getActiveCard();
    const cardId = cardElement.current.id;
    const activeId = activeCard?.id ?? null;
    if (activeId === cardId) {
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      handleAnimation(activeCard, 'delete');
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
      {item.type === 'warrior' && (
        <>
          <h3 className={styles.warriorPower}>{getWarriorPower(item)}</h3>
          <h3 className={styles.warriorHealth}>{item.currentHP}</h3>
        </>
      )}
      {item.type !== 'hero' && (
        <h3 className={styles.cost}>{item.currentC}</h3>
      )}
      {item.type === 'hero' && (
        <h3 className={styles.heroHealth}>{item.currentHP}</h3>
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
