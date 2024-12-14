import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AttackIcon from '@assets/battlefield/BladeAttack.webp';
// import { spellsCells } from '../../../gameData/heroes&spellsCellsData.js';
import CellCard from '../CellCard/CellCard.jsx';
// import AttachedSpellCards from '../AttachedCellCards/AttachedSpellCards.jsx';
import styles from './Cell.module.css';
import useClickActions from '../../../hooks/useClickActions.js';
import isWarriorReady from '../../../utils/supportFunc/isWarriorReady.js';
import useCellTriggers from '../../../hooks/useCellTriggers.js';

const cardsToShow = 5;

const Cell = ({ props, id }) => {
  const { type, animation } = props;
  const [cardSource, setCardSource] = useState('hand');
  const [cardType, setCardType] = useState(null);
  const {
    fieldCells,
    fieldCards,
    lastCellWithAction,
    gameTurn,
  } = useSelector((state) => state.battleReducer);
  const cardsInCell = fieldCards.filter((card) => card.cellId === id);
  const lastCardToShowIdx = cardsInCell.length + 1 - cardsToShow;
  const cellContent = cardsInCell
    .slice(lastCardToShowIdx > 0 ? lastCardToShowIdx : 0);
  const [contLength, setContLength] = useState(cellContent.length);
  const currentCell = fieldCells.find((cell) => cell.id === id);
  const warCard = cellContent.find((card) => (card.type === 'warrior' || card.type === 'hero'));
  const readyWarrior = isWarriorReady(warCard, currentCell.player, gameTurn);

  const {
    handleCellClick,
  } = useClickActions();

  const {
    checkTriggers,
  } = useCellTriggers();

  const classes = cn({
    [styles.defaultSize]: true,
    [styles.spell]: type === 'midSpell' || type === 'topSpell',
    [styles.bigSpell]: type === 'bigSpell',
    [styles.field]: type === 'field',
    [styles.animationGreen]: animation === 'green',
    [styles.animationRed]: animation === 'red',
    [styles.animationAttacked]: animation === 'attacked',
    [styles.animationCanMakeTurn]: animation === '' && readyWarrior,
  });

  useEffect(() => {
    checkTriggers({
      cardType, cardSource, currentCell, cellContent, cellType: type,
    });
  // eslint-disable-next-line
  }, [cardType, contLength, cardSource]);

  useEffect(() => {
    if (lastCellWithAction?.id === id) {
      setCardSource(lastCellWithAction.source);
      setCardType(lastCellWithAction.type);
      setContLength((prev) => prev + lastCellWithAction.content);
    }
  }, [lastCellWithAction, id]);

  return (
    <div className={classes}>
      {animation === 'attacked' && (
      <img
        className={styles.attackIcon}
        src={AttackIcon}
        alt="attack icon"
      />
      )}
      <TransitionGroup component={null} exit>
        {cellContent.length > 0 && (
          cellContent.map((item) => (
            <CSSTransition
              key={item.id}
              timeout={500}
              classNames={{
                enter: styles.cardAnimationEnter,
                enterActive: styles.cardAnimationActive,
                exit: styles.cardAnimationExit,
                exitActive: styles.cardAnimationExitActive,
              }}
            >
              <CellCard
                key={item.id}
                item={item}
                cellType={type}
                content={cellContent}
                setContLength={setContLength}
                setCardType={setCardType}
                setCardSource={setCardSource}
              />
            </CSSTransition>
          )))}
      </TransitionGroup>
      <TransitionGroup component={null} exit={false}>
        {cellContent.length === 0 && (
          <CSSTransition
            in
            appear
            timeout={500}
            classNames={{
              enter: styles.cellAnimationEnter,
              enterActive: styles.cellAnimationActive,
              enterDone: styles.cellAnimationDone,
              exit: styles.cellAnimationExit,
              exitActive: styles.cellAnimationExitActive,
            }}
          >
            <button
              type="button"
              className={styles.defaultBtn}
              aria-label="field cell"
              style={{ cursor: `${animation !== '' ? 'pointer' : ''}` }}
              onClick={() => handleCellClick({ type, currentCell, cellContent })}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Cell;
