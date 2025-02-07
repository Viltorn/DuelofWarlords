import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import styles from './CellCard.module.css';
import CellCardImage from './CellCardImage.jsx';
import CellCardCover from './CellCardCover.jsx';
import useClickActions from '../../../hooks/useClickActions.js';
import useAnimaActions from '../../../hooks/useAnimaActions.js';
import isInvisible from '../../../utils/supportFunc/isInvisible.js';

const getTopMargin = (cellType, contentLength) => {
  if (cellType === 'field' && contentLength === 4) {
    return 5.5;
  }
  if (cellType === 'field') {
    return Math.min(2.1 * contentLength, 5.2);
  }
  if (cellType === 'hero') {
    return 6.4;
  }
  return 0;
};

const CellCard = ({
  item, cellType, content,
}) => {
  const cardElement = useRef();
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
  } = item;
  const cardsFeature = faction ?? school;

  const { fieldCells, fieldCards } = useSelector((state) => state.battleReducer);
  const { handleCellCardClick } = useClickActions();
  const { getWarriorPower, warHasSpecialFeature } = useAnimaActions();
  const protectionOfWar = type === 'warrior' || type === 'hero' ? warHasSpecialFeature({
    warCard: item, fieldCells, fieldCards, featureName: 'protection',
  }) : null;
  const showProtectionIcon = protectionOfWar && protectionOfWar?.subtype !== 'reaction' && !protectionOfWar.hide;
  const currentCell = fieldCells.find((cell) => cell.id === item.cellId);
  const atkPower = item.type === 'warrior' ? getWarriorPower(item, 'atkPower') : null;
  const defPower = item.type === 'warrior' ? getWarriorPower(item, 'defPower') : null;
  const invisible = item.type === 'warrior' && isInvisible(currentCell, fieldCards);
  const marginTop = getTopMargin(cellType, content.length);
  const marginRight = cellType === 'bigSpell' ? 5 : 0;
  const cardInfo = {
    cardsFeature, atkPower, description, currentHP, currentC, cellType, type, img, name, defPower,
  };

  const cardStyles = cn({
    [styles.contentItem]: cellType !== 'hero',
    [styles.heroCellItem]: cellType === 'hero',
    [styles.makeAttackAnimation]: currentCell.animation === 'makeattack',
    [styles.turn1]: turn === 1,
    [styles.turn2]: turn === 2,
  });

  return (
    <button
      ref={cardElement}
      id={item.id}
      onClick={() => handleCellCardClick({ item, cardElement })}
      key={item.id}
      type="button"
      data={item.player}
      className={cardStyles}
      style={{ marginTop: `-${marginTop}rem`, marginRight: `-${marginRight}rem` }}
    >
      {subtype !== 'reaction' ? (
        <CellCardImage
          cardInfo={cardInfo}
          currentCell={currentCell}
          protection={showProtectionIcon}
          isInvisible={invisible}
        />
      ) : (<CellCardCover />)}
    </button>
  );
};

export default CellCard;
