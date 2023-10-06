import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';
import styles from './Cell.module.css';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';

const Cell = ({ props, id }) => {
  // const { t } = useTranslation();
  const [cardSource, setCardSource] = useState('hand');
  const [cardType, setCardType] = useState('');
  const {
    thisPlayer, playerPoints, fieldCells,
  } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();
  const { type, content, animation } = props;
  const {
    deleteCardfromSource,
    getActiveCard,
    moveAttachedSpells,
    canBeMoved,
    handleAnimation,
    canBeCast,
    isAllowedCost,
    changeTutorStep,
  } = useContext(functionContext);

  const { gameMode } = useSelector((state) => state.gameReducer);
  const [contLength, setContLength] = useState(content.length);
  const { makeFeatureCast, makeFeatureAttach, findTriggerSpells } = useContext(abilityContext);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const currentCell = fieldCells.find((cell) => cell.id === id);

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
      makeFeatureCast(returnSpell, thisCell, card);
    } else {
      onTriggerSpells.forEach((spell) => makeFeatureCast(spell, thisCell, card));
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
        onMoveSpells.forEach((spell) => makeFeatureCast(spell, currentCell, spellCard));
      }
      if (spellCard && (cardSource === 'hand' || cardSource === 'postponed')) {
        const onPlaySpells = findTriggerSpells(spellCard, currentCell, 'onplay', 'spell');
        onPlaySpells.forEach((spell) => makeFeatureCast(spell, currentCell, spellCard));
      }
    }
  // eslint-disable-next-line
  }, [cardType, contLength, cardSource]);

  const handleCellClick = () => {
    const activeCard = getActiveCard();

    const addCardToField = () => {
      if (gameMode === 'tutorial') {
        changeTutorStep((prev) => prev + 1);
      }
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.currentC;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      handleAnimation(activeCard, 'delete');
      deleteCardfromSource(activeCard);
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      moveAttachedSpells(activeCard, id, 'move');
      setContLength((prev) => prev + 1);
      setCardSource(activeCard.status);
      setCardType(activeCard.type);
      if (activeCard.type === 'warrior') {
        if (activeCard.status === 'field') {
          const movingAttachment = activeCard.attachments.find((feature) => feature.name === 'moving');
          const hasSwift = activeCard.features.find((feat) => feat.name === 'swift')
            || activeCard.attachments.find((feature) => feature.name === 'swift');
          if (!hasSwift && activeCard.player === thisPlayer && !movingAttachment) {
            dispatch(battleActions.turnCardLeft({
              cardId: activeCard.id,
              cellId: id,
              qty: 1,
            }));
          }
        }
        const attachSpells = activeCard.features.filter((feat) => feat.attach);
        attachSpells.forEach((spell) => makeFeatureAttach(spell, currentCell));
      }
      if (activeCard.type === 'spell') {
        activeCard.features
          .forEach((feature) => setTimeout(() => {
            if (!feature.condition && !feature.attach) {
              makeFeatureCast(feature, currentCell);
            } else if (feature.attach) {
              makeFeatureAttach(feature, currentCell);
            }
          }, 1000));
      }
    };

    if (activeCard && !isAllowedCost(activeCard)) {
      return;
    }

    const isWarOnFieldCard = activeCard && activeCard.type === 'warrior' && type === 'field' && content.length === 0;
    const isSpell = activeCard && activeCard.type === 'spell';

    if ((isWarOnFieldCard && canBeMoved(id)) || (isSpell && canBeCast(id))) {
      addCardToField();
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
                setCardType={setCardType}
                setContLength={setContLength}
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
