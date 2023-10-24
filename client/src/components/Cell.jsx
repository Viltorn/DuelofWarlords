import React, { useContext, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
// import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';
import styles from './Cell.module.css';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';
import socket from '../socket.js';

const Cell = ({ props, id, cellData }) => {
  // const { t } = useTranslation();
  const { type, content, animation } = props;
  const [cardSource, setCardSource] = useState('hand');
  const [cardType, setCardType] = useState('');
  const [contLength, setContLength] = useState(content.length);
  const {
    fieldCells,
    thisPlayer,
    playerPoints,
  } = useSelector((state) => state.battleReducer);

  const {
    isAllowedCost,
    getActiveCard,
    canBeMoved,
    canBeCast,
  } = useContext(functionContext);

  const { curRoom } = useSelector((state) => state.gameReducer);
  const { makeFeatureCast, findTriggerSpells, addCardToField } = useContext(abilityContext);
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
      const warrior = currentCell.content.find((item) => item.type === 'warrior');
      console.log(warrior);
      if (type === 'field' && warrior && cardSource === 'field') {
        playTriggers(warrior, currentCell, 'onmove', 'warrior');
      }
      if (type === 'field' && warrior && (cardSource === 'hand' || cardSource === 'postponed')) {
        playTriggers(warrior, currentCell, 'onplay', 'warrior');
      }
    }
    if (cardType === 'spell') {
      const spellCard = currentCell.content.find((item, i) => item.type === 'spell' && i === 0);
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
    if (cellData?.id === id) {
      setCardSource(cellData.source);
      setCardType(cellData.type);
      setContLength((prev) => prev + cellData.content);
    }
  }, [cellData, id]);

  const handleCellClick = () => {
    const activeCard = getActiveCard();

    if (activeCard && !isAllowedCost(activeCard)) {
      return;
    }

    const isWarOnFieldCard = activeCard && activeCard.type === 'warrior' && type === 'field' && content.length === 0;
    const isSpell = activeCard && activeCard.type === 'spell';

    if ((isWarOnFieldCard && canBeMoved(id)) || (isSpell && canBeCast(id))) {
      addCardToField(activeCard, thisPlayer, currentPoints, currentCell);
      socket.emit('makeMove', {
        move: 'addCardToField',
        room: curRoom,
        card: activeCard,
        player: thisPlayer,
        points: currentPoints,
        cell: currentCell,
      });
    }
  };

  return (
    <div className={classes}>
      <TransitionGroup component={null} exit>
        {content.length !== 0 && (
          content.map((item) => (
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
                content={content}
                setContLength={setContLength}
                setCardType={setCardType}
                setCardSource={setCardSource}
              />
            </CSSTransition>
          )))}
      </TransitionGroup>
      <TransitionGroup component={null} exit={false}>
        {content.length === 0 && (
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
