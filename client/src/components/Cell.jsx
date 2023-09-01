import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// import { useTranslation } from 'react-i18next';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';
import './Cell.css';
import functionContext from '../contexts/functionsContext.js';
import abilityContext from '../contexts/abilityActions.js';

const Cell = ({ props, id }) => {
  // const { t } = useTranslation();
  const {
    thisPlayer, playerPoints,
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
  } = useContext(functionContext);
  const { makeFeatureCast } = useContext(abilityContext);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;

  const classes = cn({
    'cell__default-size': true,
    cell__spell: type === 'midSpell' || type === 'topSpell',
    'cell__big-spell': type === 'bigSpell',
    cell__field: type === 'field',
    cell__animation_green: animation === 'green',
    cell__animation_red: animation === 'red',
  });

  const isAllowedCost = (card) => {
    const newCost = currentPoints - card.cost;
    if ((card.status === 'hand' && newCost >= 0) || card.status !== 'hand') {
      return true;
    }
    return false;
  };

  const handleCellClick = () => {
    const activeCard = getActiveCard();

    const addCardToField = () => {
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.cost;
        dispatch(battleActions.setPlayerPoints({ points: newPoints, player: thisPlayer }));
      }
      handleAnimation(activeCard, 'delete');
      dispatch(battleActions.addFieldContent({ activeCard, id }));
      deleteCardfromSource(activeCard);
      dispatch(battleActions.deleteActiveCard({ player: thisPlayer }));
      moveAttachedSpells(activeCard, id, 'move');
      if (activeCard.type === 'warrior' && activeCard.status === 'field') {
        const movingAttachment = activeCard.attachments.find((feature) => feature.name === 'moving');
        const hasSwift = activeCard.features.swift
          || activeCard.attachments.find((feature) => feature.name === 'swift');
        if (!hasSwift && activeCard.player === thisPlayer && !movingAttachment) {
          dispatch(battleActions.turnCardLeft({
            cardId: activeCard.id,
            cellId: id,
            qty: 1,
          }));
        }
      }
      if (activeCard.type === 'spell') {
        activeCard.features
          .forEach((feature) => setTimeout(() => makeFeatureCast(feature, null), 1000));
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
            <CSSTransition key={item.id} timeout={500} classNames="cardanimation">
              <CellCard
                key={item.id}
                item={item}
                type={type}
                content={content}
              />
            </CSSTransition>
          )))}
      </TransitionGroup>
      <TransitionGroup component={null} exit={false}>
        {content.length === 0 && (
          <CSSTransition in timeout={500} classNames="cellanimation">
            <button type="button" className="cell__default-btn" aria-label="field cell" onClick={handleCellClick} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Cell;
