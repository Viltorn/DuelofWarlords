/* eslint-disable max-len */
import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import styles from './CellCard.module.css';
import CellCardImage from './CellCardImage.jsx';
// import CellCardCover from './CellCardCover.jsx';
import isWarriorReady from '../../../utils/supportFunc/isWarriorReady.js';
import useClickActions from '../../../hooks/useClickActions.js';
import useAnimaActions from '../../../hooks/useAnimaActions.js';
import isInvisible from '../../../utils/supportFunc/isInvisible.js';

const getTopMargin = (cellType, contentLength) => {
  if (cellType === 'field' && contentLength === 6) {
    return 6;
  }
  if (cellType === 'field' && contentLength === 5) {
    return 5.8;
  }
  if (cellType === 'field' && contentLength === 4) {
    return 5.6;
  }
  if (cellType === 'field') {
    return Math.min(2.3 * contentLength, 5.4);
  }
  if (cellType === 'hero') {
    return Math.min(2.6 * contentLength, 6.8);
  }
  return 0;
};

const calcBigSpellMargin = (contentLength) => {
  if (contentLength === 1) return 0;
  return 5;
};

const CellCard = forwardRef(({
  item, cellType, cardsShownNum,
}, ref) => {
  const {
    turn,
    faction,
    description,
    school,
    currentHP,
    currentC,
    subtype,
    type,
    img,
    name,
    showQty,
    defPower,
    power,
  } = item;
  const cardsFeature = faction ?? school;

  const {
    fieldCells, fieldCards, gameTurn,
  } = useSelector((state) => state.battleReducer);
  const { handleCellCardClick } = useClickActions();
  const { getWarriorPower, warTokensData } = useAnimaActions();
  const warTokens = type === 'warrior' || type === 'hero' ? warTokensData({ warCard: item, fieldCells, fieldCards }) : null;
  const currentCell = fieldCells.find((cell) => cell.id === item.cellId);
  const currentP = item.type === 'warrior' ? getWarriorPower(item, 'atkPower') : null;
  const currentDP = item.type === 'warrior' ? getWarriorPower(item, 'defPower') : null;
  const invisible = item.type === 'warrior' && isInvisible(currentCell, fieldCards);
  const marginTop = getTopMargin(cellType, cardsShownNum);
  const marginRight = cellType === 'bigSpell' ? calcBigSpellMargin(cardsShownNum) : 0;
  const readyWarrior = type === 'warrior' ? isWarriorReady(item, gameTurn) : false;
  const cardInfo = {
    cardsFeature,
    currentP,
    description,
    currentHP,
    currentC,
    cellType,
    type,
    img,
    name,
    currentDP,
    subtype,
    showQty,
    defPower,
    power,
  };

  const cardStyles = cn({
    [styles.contentItem]: cellType !== 'hero',
    [styles.heroCellItem]: cellType === 'hero',
    [styles.makeAttackAnima]: currentCell.animation === 'makeattack',
    [styles.readyWarrior]: readyWarrior,
    // [styles.turn1]: turn === 1,
    [styles.turn2]: turn === 2,
  });

  return (
    <button
      ref={ref}
      id={item.id}
      onClick={() => handleCellCardClick({ item, cardElement: ref })}
      key={item.id}
      type="button"
      data={item.player}
      className={cardStyles}
      style={{ marginTop: `-${marginTop}rem`, marginRight: `-${marginRight}rem` }}
    >
      <CellCardImage
        cardInfo={cardInfo}
        currentCell={currentCell}
        warTokens={warTokens}
        isInvisible={invisible}
      />
    </button>
  );
});

CellCard.displayName = 'CellCard';
export default CellCard;
