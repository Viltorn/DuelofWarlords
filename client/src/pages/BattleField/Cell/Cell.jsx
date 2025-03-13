/* eslint-disable max-len */
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AnimationIcon from '../../../components/AnimationIcons/AnimationIcon.jsx';
// import AttachedSpells from '../../../gameCardsData/attachedSpells.js';
import CellCard from '../CellCard/CellCard.jsx';
import styles from './Cell.module.css';
import useClickActions from '../../../hooks/useClickActions.js';
// import isWarriorReady from '../../../utils/supportFunc/isWarriorReady.js';
import useCellTriggers from '../../../hooks/useCellTriggers.js';
import icons from '../../../gameData/animationIcons.js';

// const cardsToShow = 4;

const Cell = ({ props, id }) => {
  const { type, animation } = props;
  const [cardSource, setCardSource] = useState('hand');
  const [cardType, setCardType] = useState(null);
  const cellRef = useRef();
  const buttonRef = useRef();

  const {
    fieldCells,
    fieldCards,
    lastCellWithAction,
    thisPlayer,
  } = useSelector((state) => state.battleReducer);
  const cellContent = fieldCards.filter((card) => card.cellId === id);
  // const attachedSpell = { ...AttachedSpells, showQty: spellsInCell.length, cellId: id };
  // const lastCardToShowIdx = cardsInCell.length + 1 - cardsToShow;
  const cardsToShow = cellContent.filter((c) => (!(c.subtype === 'reaction' && c.player !== thisPlayer)) && !c.token);
  // const cardsToShow = type === 'field' && cellContent.length > 1 ? [attachedSpell, cellContent[cellContent.length - 1]] : filteredCards;
  // cardsInCell.slice(lastCardToShowIdx > 0 ? lastCardToShowIdx : 0);
  const [contLength, setContLength] = useState(cellContent.length);
  const currentCell = fieldCells.find((cell) => cell.id === id);
  // const heroCard = cellContent.find((card) => card.type === 'hero');
  // const readyHero = isWarriorReady(heroCard, thisPlayer, gameTurn);

  const { handleCellClick } = useClickActions();
  const { checkTriggers } = useCellTriggers();

  const classes = cn({
    [styles.defaultSize]: type !== 'topSpell' && type !== 'bigSpell',
    [styles.spell]: type === 'midSpell' || type === 'topSpell',
    [styles.topSpell]: type === 'topSpell' || type === 'bigSpell',
    [styles.bigSpell]: type === 'bigSpell',
    [styles.justifyCenter]: type === 'bigSpell' && cardsToShow.length === 1,
    [styles.field]: type === 'field',
    [styles.animationGreen]: animation === 'green' && type !== 'midSpell' && type !== 'topSpell',
    [styles.animationGreenInset]: animation === 'green' && (type === 'midSpell' || type === 'topSpell'),
    [styles.animationRedInset]: animation === 'red' && (type === 'midSpell' || type === 'topSpell' || type === 'bigSpell'),
    [styles.animationRed]: animation === 'red' && type !== 'midSpell' && type !== 'topSpell' && type !== 'bigSpell',
    // [styles.animationCanMakeTurn]: animation === '' && readyHero && !currentCell.disabled,
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
    <div className={classes} ref={cellRef}>
      {animation !== '' && icons[animation] && (
        <AnimationIcon animation={animation} icon={icons[animation]} />
      )}
      <TransitionGroup component={null} exit>
        {cellContent.length > 0 && (
          cardsToShow.map((item) => {
            const cardRef = React.createRef();
            return (
              <CSSTransition
                key={item.id}
                timeout={500}
                classNames={{
                  enter: styles.cardAnimationEnter,
                  enterActive: styles.cardAnimationActive,
                  exit: styles.cardAnimationExit,
                  exitActive: styles.cardAnimationExitActive,
                }}
                nodeRef={cardRef}
              >
                <CellCard
                  key={item.id}
                  item={item}
                  cellType={type}
                  content={cellContent}
                  cardsShownNum={cardsToShow.length}
                  cellId={id}
                  ref={cardRef}
                />
              </CSSTransition>
            );
          }))}
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
            nodeRef={buttonRef}
          >
            <button
              type="button"
              className={styles.defaultBtn}
              aria-label="field cell"
              style={{ cursor: `${animation !== '' ? 'pointer' : ''}` }}
              onClick={() => handleCellClick({ type, currentCell, cellContent })}
              ref={buttonRef}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Cell;
