import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import styles from './CellCard.module.css';
import CellCardImage from './CellCardImage.jsx';
import CellCardCover from './CellCardCover.jsx';
import useClickActions from '../../../hooks/useClickActions.js';
import useAnimaActions from '../../../hooks/useAnimaActions.js';

const getTopMargin = (cellType, contentLength) => {
  if (cellType === 'field') {
    return Math.min(2.3 * contentLength, 5.3);
  }
  if (cellType === 'hero') {
    return 6.5;
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

  const { handleCellCardClick } = useClickActions();
  const { getWarriorPower } = useAnimaActions();
  const { fieldCells } = useSelector((state) => state.battleReducer);
  const currentCell = fieldCells.find((cell) => cell.id === item.cellId);
  const power = item.type === 'warrior' ? getWarriorPower(item) : null;
  const marginTop = getTopMargin(cellType, content.length);
  const marginRight = cellType === 'bigSpell' ? 5 : 0;
  const cardInfo = {
    cardsFeature, power, description, currentHP, currentC, cellType, type, img, name,
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
        <CellCardImage cardInfo={cardInfo} currentCell={currentCell} />
      ) : (<CellCardCover />)}
    </button>
  );
};

export default CellCard;
