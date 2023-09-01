import React, { useRef, useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { actions as battleActions } from '../slices/battleSlice.js';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import AttackIcon from '../assets/battlefield/Sword.png';
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

const CellCard = ({ item, type }) => {
  const {
    deleteCardfromSource,
    getActiveCard,
    handleAnimation,
    canBeAttacked,
    moveAttachedSpells,
    canBeCast,
    isKilled,
    changeCardHP,
    getWarriorProperty,
  } = useContext(functionContext);
  const { makeFeatureCast } = useContext(abilityContext);
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

  const checkCondition = (checkingCard, spell) => {
    if (spell.condition && spell.condition === 'attackingPower') {
      const attackingPower = getWarriorProperty(checkingCard, 'power');
      const meetCondition = attackingPower >= spell.conditionValue;
      return meetCondition;
    }
    return true;
  };

  const makeFight = (card1, card2) => {
    setTimeout(() => {
      handleAnimation(card1, 'delete');
    }, 2000);

    const attackedCell = fieldCells.find((cell) => cell.id === card2.cellId);
    const attackingCell = fieldCells.find((cell) => cell.id === card1.cellId);

    const findProtection = (attack, protect, attackType) => {
      const thisCell = fieldCells.find((cell) => cell.id === protect.cellId);
      const cardProtection = protect.attachments.find((spell) => spell.name === 'protection' && spell.aim.includes(attackType));
      const cellProtection = thisCell.attachments.find((spell) => spell.name === 'protection' && spell.aim.includes(attackType));
      const canCellProtect = cellProtection && checkCondition(attack, cellProtection);
      const canCardProtect = cardProtection && checkCondition(attack, cardProtection);
      if (canCellProtect) {
        return cellProtection;
      }
      if (canCardProtect) {
        return cardProtection;
      }
      return null;
    };

    const makeCounterStrike = (strikeCard, recieveCard) => {
      dispatch(battleActions.addAnimation({ cell: attackedCell, type: 'makeattack' }));
      const strikePower = getWarriorProperty(strikeCard, 'power');
      const recieveHealth = getWarriorProperty(recieveCard, 'health');
      if (isKilled(strikePower, recieveHealth)) {
        deleteCardfromSource(recieveCard);
        dispatch(battleActions.addToGraveyard({ card: recieveCard }));
        moveAttachedSpells(recieveCard, null, 'kill');
      } else {
        changeCardHP(strikePower, recieveHealth, recieveCard);
      }
    };

    handleAnimation(card1, 'delete');
    dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    dispatch(battleActions.turnCardLeft({
      cardId: card1.id,
      cellId: card1.cellId,
      qty: 1,
    }));

    dispatch(battleActions.addAnimation({ cell: attackingCell, type: 'makeattack' }));
    dispatch(battleActions.addAnimation({ cell: attackedCell, type: 'attacked' }));

    const attackingPower = getWarriorProperty(card1, 'power');
    const attackedHealth = getWarriorProperty(card2, 'health');
    const protection = findProtection(card1, card2, 'warrior');
    const protectionVal = protection?.value ?? 0;
    const retaliationFeature = card2.features.retaliation
      || card2.attachments.find((spell) => spell.name === 'retaliation');
    const canRetaliate = card2.subtype !== 'shooter' && card2.type !== 'hero' && card1.subtype !== 'shooter';

    const calculatedPower = attackingPower - protectionVal > 0 ? attackingPower - protectionVal : 0;

    const powerSpells = card1.attachments.filter((spell) => spell.name === 'power');
    powerSpells.forEach((spell) => {
      if (spell.charges === 1) {
        const powerCard = currentCell.content.find((el) => el.id === spell.id);
        dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
        deleteCardfromSource(powerCard);
        dispatch(battleActions.addToGraveyard({ card: powerCard }));
      }
    });

    if (protection && protection.charges === 1) {
      const protectionCard = fieldCells.reduce((acc, cell) => {
        const searchingCard = cell.content.find((el) => el.id === protection.id);
        if (searchingCard) {
          acc = searchingCard;
        }
        return acc;
      }, {});
      dispatch(battleActions.deleteAttachment({ spellId: protection.id }));
      deleteCardfromSource(protectionCard);
      dispatch(battleActions.addToGraveyard({ card: protectionCard }));
    }

    if (isKilled(calculatedPower, attackedHealth)) {
      deleteCardfromSource(card2);
      dispatch(battleActions.addToGraveyard({ card: card2 }));
      moveAttachedSpells(card2, null, 'kill');
    } else {
      changeCardHP(calculatedPower, attackedHealth, card2);
      if (canRetaliate || retaliationFeature) {
        makeCounterStrike(card2, card1);
      }
    }
  };

  const makeCast = (spell, receiveCard) => {
    dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    deleteCardfromSource(spell);
    spell.features
      .forEach((feature) => setTimeout(() => makeFeatureCast(feature, receiveCard), 1000));

    if (spell.subtype === 'instant') {
      dispatch(battleActions.addToGraveyard({ card: spell }));
    } else {
      dispatch(battleActions.addFieldContent({ activeCard: spell, id: receiveCard.cellId }));
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
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.cost;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      handleAnimation(activeCard, 'delete');
      deleteCardfromSource(activeCard);
      makeCast(activeCard, item);
    } else if (canBeAttacked(item)) {
      makeFight(activeCard, item);
    } else {
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
          <h3 className="cell-container__warrior-power">{getWarriorProperty(item, 'power')}</h3>
          <h3 className="cell-container__warrior-health">{getWarriorProperty(item, 'health')}</h3>
        </>
      )}
      {item.type === 'hero' && (
        <h3 className="cell-container__hero-health">{getWarriorProperty(item, 'health')}</h3>
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

    </button>
  );
};

export default CellCard;
