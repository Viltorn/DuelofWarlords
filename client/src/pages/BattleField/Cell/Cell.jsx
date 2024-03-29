import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from '../CellCard/CellCard.jsx';
import styles from './Cell.module.css';
import functionContext from '../../../contexts/functionsContext.js';
import findTriggerSpells from '../../../utils/supportFunc/findTriggerSpells.js';

const Cell = ({ props, id }) => {
  const { type, animation } = props;
  const [cardSource, setCardSource] = useState('hand');
  const [cardType, setCardType] = useState(null);
  const {
    fieldCells,
    fieldCards,
    thisPlayer,
    playerPoints,
    lastCellWithAction,
  } = useSelector((state) => state.battleReducer);
  const cellContent = fieldCards.filter((card) => card.cellId === id);
  const [contLength, setContLength] = useState(cellContent.length);

  const {
    isAllowedCost,
    getActiveCard,
    canBeMoved,
    canBeCast,
    makeFeatureCast,
    actionPerforming,
    makeGameAction,
  } = useContext(functionContext);

  const { curRoom, gameMode } = useSelector((state) => state.gameReducer);
  const currentCell = fieldCells.find((cell) => cell.id === id);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;

  const classes = cn({
    [styles.defaultSize]: true,
    [styles.spell]: type === 'midSpell' || type === 'topSpell',
    [styles.bigSpell]: type === 'bigSpell',
    [styles.field]: type === 'field',
    [styles.animationGreen]: animation === 'green',
    [styles.animationRed]: animation === 'red',
  });

  const playTriggers = (card, thisCell, spellType, cardclass) => {
    const onTriggerSpells = findTriggerSpells(card, thisCell, spellType, cardclass);
    const returnSpell = onTriggerSpells.find((spell) => spell.name === 'return');
    if (returnSpell) {
      makeFeatureCast(returnSpell, thisCell, card, card.player);
    } else {
      onTriggerSpells.forEach((spell) => makeFeatureCast(spell, thisCell, card, card.player));
    }
  };

  useEffect(() => {
    if (cardType === 'warrior') {
      const warrior = cellContent.find((item) => item.type === 'warrior');
      if (type === 'field' && warrior && cardSource === 'field') {
        playTriggers(warrior, currentCell, 'onmove', 'warrior');
      }
      if (type === 'field' && warrior && (cardSource === 'hand' || cardSource === 'postponed')) {
        playTriggers(warrior, currentCell, 'onplay', 'warrior');
      }
    }
    if (cardType === 'spell') {
      const spellCard = cellContent.find((item, i) => item.type === 'spell' && i === 0);
      if (spellCard && cardSource === 'field') {
        const onMoveSpells = findTriggerSpells(spellCard, currentCell, 'onmove', 'spell');
        onMoveSpells.forEach((spell) => {
          makeFeatureCast(spell, currentCell, spellCard, spellCard.player);
        });
      }
      if (spellCard && (cardSource === 'hand' || cardSource === 'postponed')) {
        const onPlaySpells = findTriggerSpells(spellCard, currentCell, 'onplay', 'spell');
        onPlaySpells.forEach((spell) => {
          makeFeatureCast(spell, currentCell, spellCard, spellCard.player);
        });
      }
    }
  // eslint-disable-next-line
  }, [cardType, contLength, cardSource]);

  useEffect(() => {
    if (lastCellWithAction?.id === id) {
      setCardSource(lastCellWithAction.source);
      setCardType(lastCellWithAction.type);
      setContLength((prev) => prev + lastCellWithAction.content);
    }
  }, [lastCellWithAction, id]);

  const handleCellClick = () => {
    const activeCard = getActiveCard();

    if (gameMode === 'online' && actionPerforming) {
      return;
    }

    if (activeCard && !isAllowedCost(activeCard, currentPoints)) {
      return;
    }

    const isWarOnFieldCard = activeCard && activeCard.type === 'warrior' && type === 'field' && cellContent.length === 0;
    const isSpell = activeCard && activeCard.type === 'spell';

    if ((isWarOnFieldCard && canBeMoved(id)) || (isSpell && canBeCast(id))) {
      const data = {
        move: 'addCardToField',
        room: curRoom,
        card: activeCard,
        player: thisPlayer,
        points: currentPoints,
        curCell: currentCell,
        fieldCards,
        cellsOnField: fieldCells,
      };
      makeGameAction(data, gameMode);
    }
  };

  return (
    <div className={classes}>
      <TransitionGroup component={null} exit>
        {cellContent.length !== 0 && (
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
                type={type}
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
              onClick={handleCellClick}
            />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Cell;
