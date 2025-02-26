import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AnimationIcon from '../../../components/AnimationIcons/AnimationIcon.jsx';
import CellCard from '../CellCard/CellCard.jsx';
import styles from './Cell.module.css';
import useClickActions from '../../../hooks/useClickActions.js';
import isWarriorReady from '../../../utils/supportFunc/isWarriorReady.js';
import useCellTriggers from '../../../hooks/useCellTriggers.js';
import icons from '../../../gameData/animationIcons.js';

const cardsToShow = 4;

const Cell = ({ props, id }) => {
  const { type, animation } = props;
  const [cardSource, setCardSource] = useState('hand');
  const [cardType, setCardType] = useState(null);
  const {
    fieldCells,
    fieldCards,
    lastCellWithAction,
    gameTurn,
    thisPlayer,
  } = useSelector((state) => state.battleReducer);
  const cardsInCell = fieldCards.filter((card) => card.cellId === id);
  const lastCardToShowIdx = cardsInCell.length + 1 - cardsToShow;
  const cellContent = cardsInCell
    .slice(lastCardToShowIdx > 0 ? lastCardToShowIdx : 0);
  const [contLength, setContLength] = useState(cellContent.length);
  const currentCell = fieldCells.find((cell) => cell.id === id);
  const warCard = cellContent.find((card) => (card.type === 'warrior' || card.type === 'hero'));
  const readyWarrior = isWarriorReady(warCard, thisPlayer, gameTurn);

  const {
    handleCellClick,
  } = useClickActions();

  const {
    checkTriggers,
  } = useCellTriggers();

  const classes = cn({
    [styles.defaultSize]: type !== 'topSpell' && type !== 'bigSpell',
    [styles.spell]: type === 'midSpell' || type === 'topSpell',
    [styles.topSpell]: type === 'topSpell' || type === 'bigSpell',
    [styles.bigSpell]: type === 'bigSpell',
    [styles.justifyCenter]: type === 'bigSpell' && cellContent.length === 1,
    [styles.field]: type === 'field',
    [styles.animationGreen]: animation === 'green' && type !== 'midSpell' && type !== 'topSpell',
    [styles.animationGreenInset]: animation === 'green' && (type === 'midSpell' || type === 'topSpell'),
    [styles.animationRedInset]: animation === 'red' && (type === 'midSpell' || type === 'topSpell' || type === 'bigSpell'),
    [styles.animationRed]: animation === 'red' && type !== 'midSpell' && type !== 'topSpell' && type !== 'bigSpell',
    [styles.animationCanMakeTurn]: animation === '' && readyWarrior && !currentCell.disabled,
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
      {animation !== '' && icons[animation] && (
        <AnimationIcon animation={animation} icon={icons[animation]} />
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
