import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import AttackIcon from '@assets/battlefield/BladeAttack.webp';
import CellCard from '../CellCard/CellCard.jsx';
import styles from './Cell.module.css';
import findTriggerSpells from '../../../utils/supportFunc/findTriggerSpells.js';
import useBattleActions from '../../../hooks/useBattleActions.js';
import useClickActions from '../../../hooks/useClickActions.js';
import isWarriorReady from '../../../utils/supportFunc/isWarriorReady.js';

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
  const cellContent = fieldCards.filter((card) => card.cellId === id);
  const [contLength, setContLength] = useState(cellContent.length);
  const currentCell = fieldCells.find((cell) => cell.id === id);
  const readyWarrior = isWarriorReady(cellContent, currentCell.player, gameTurn);

  const {
    makeFeatureCast,
  } = useBattleActions();

  const {
    handleCellClick,
  } = useClickActions();

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

  const playTriggers = (card, thisCell, spellType, cardclass) => {
    const onTriggerSpells = findTriggerSpells(card, thisCell, spellType, cardclass);
    const returnSpell = onTriggerSpells.find((spell) => spell.name === 'return');
    if (returnSpell) {
      makeFeatureCast(returnSpell, thisCell, card, returnSpell.player);
    } else {
      onTriggerSpells
        .forEach((spell) => makeFeatureCast(spell, thisCell, card, spell.player));
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
