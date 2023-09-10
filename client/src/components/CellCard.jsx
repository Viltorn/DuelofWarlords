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
    moveAttachedSpells,
    canBeCast,
    isKilled,
    changeCardHP,
    getWarriorPower,
  } = useContext(functionContext);
  const {
    makeFeatureCast,
    findSpell,
    findTriggerSpells,
    makeFeatureAttach,
    sendCardFromField,
    getProtectionVal,
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

  const findOwnerOfSpell = (spellId) => {
    const onwnerCell = fieldCells.find((cell) => cell.content
      .find((el) => el.id === spellId.id));
    return onwnerCell.content.find((el) => el.type === 'warrior');
  };

  const makeFight = (card1, card2) => {
    // setTimeout(() => {
    //   handleAnimation(card1, 'delete');
    // }, 2000);

    handleAnimation(card1, 'delete');
    const attackedCell = fieldCells.find((cell) => cell.id === card2.cellId);
    const attackingCell = fieldCells.find((cell) => cell.id === card1.cellId);
    const onAttackSpells = findTriggerSpells(card1, currentCell, 'onattack', 'warrior');

    onAttackSpells.forEach((spell) => {
      if (spell.type === 'bad' && spell.player === thisPlayer) {
        makeFeatureCast(spell, attackedCell);
      } else {
        makeFeatureCast(spell, attackingCell);
      }
    });

    const makeCounterStrike = (
      strikeCard,
      recieveCard,
      retaliate,
      attachretaliate,
    ) => {
      dispatch(battleActions.addAnimation({ cell: attackedCell, type: 'makeattack' }));
      const strikePower = retaliate ? getWarriorPower(strikeCard) : 0;
      const attachPower = attachretaliate ? attachretaliate.value : 0;
      const totalStrikePower = strikePower + attachPower;
      const recieveHealth = recieveCard.currentHP;
      if (isKilled(totalStrikePower, recieveHealth)) {
        sendCardFromField(recieveCard, 'grave');
        moveAttachedSpells(recieveCard, null, 'kill');
      } else {
        changeCardHP(totalStrikePower, recieveHealth, recieveCard);
      }
      const powerSpells = strikeCard.attachments.filter((spell) => spell.name === 'power');
      powerSpells.forEach((spell) => {
        if (spell.charges === 1) {
          const spellCard = fieldCells.reduce((acc, cell) => {
            const searchingCard = cell.content.find((el) => el.id === spell.id);
            if (searchingCard) {
              acc = searchingCard;
            }
            return acc;
          }, null);
          if (spellCard) {
            sendCardFromField(spellCard, 'grave');
          } else {
            dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
          }
        }
      });
    };

    dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
    dispatch(battleActions.turnCardLeft({
      cardId: card1.id,
      cellId: card1.cellId,
      qty: 1,
    }));

    dispatch(battleActions.addAnimation({ cell: attackingCell, type: 'makeattack' }));
    const evade = findSpell(card1, card2, 'warrior', 'evade');
    if (evade) {
      makeFeatureCast(evade, attackedCell);
      return;
    }

    dispatch(battleActions.addAnimation({ cell: attackedCell, type: 'attacked' }));

    const attackingPower = getWarriorPower(card1, 'power');
    const attackedHealth = card2.currentHP;
    const protection = findSpell(card1, card2, card1.subtype, 'protection');
    const protectionVal = protection
      ? getProtectionVal(attackingPower, protection, attackedHealth) : 0;

    const attackedCard = protectionVal === 'redirectowner' ? findOwnerOfSpell(protection) : card2;
    const newAttackedHealth = attackedCard.currentHP;
    const newProtectionVal = protectionVal === 'redirectowner' ? 0 : protectionVal;

    const retaliatAttachFeature = findSpell(card1, attackedCard, card1.subtype, 'retaliation');
    const canRetaliate = attackedCard.subtype !== 'shooter' && attackedCard.type !== 'hero' && card1.subtype !== 'shooter';

    const calculatedPower = attackingPower - newProtectionVal > 0
      ? attackingPower - newProtectionVal : 0;

    const powerSpells = card1.attachments.filter((spell) => spell.name === 'power');
    powerSpells.forEach((spell) => {
      if (spell.charges === 1) {
        const spellCard = fieldCells.reduce((acc, cell) => {
          const searchingCard = cell.content.find((el) => el.id === spell.id);
          if (searchingCard) {
            acc = searchingCard;
          }
          return acc;
        }, null);
        if (spellCard) {
          sendCardFromField(spellCard, 'grave');
        } else {
          dispatch(battleActions.deleteAttachment({ spellId: spell.id }));
        }
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

    if (isKilled(calculatedPower, newAttackedHealth)) {
      sendCardFromField(attackedCard, 'grave');
      moveAttachedSpells(attackedCard, null, 'kill');
    } else {
      changeCardHP(calculatedPower, newAttackedHealth, attackedCard);
      if (canRetaliate || retaliatAttachFeature) {
        makeCounterStrike(attackedCard, card1, canRetaliate, retaliatAttachFeature);
      }
    }
  };

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
        const newPoints = currentPoints - activeCard.cost;
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
