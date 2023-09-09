import React, { useContext, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cn from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { actions as battleActions } from '../slices/battleSlice.js';
import CellCard from './CellCard.jsx';
import './Cell.css';
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
  } = useContext(functionContext);
  const [contLength, setContLength] = useState(content.length);
  const { makeFeatureCast, makeFeatureAttach, findTriggerSpells } = useContext(abilityContext);
  const currentPoints = playerPoints.find((item) => item.player === thisPlayer).points;
  const currentCell = fieldCells.find((cell) => cell.id === id);

  const classes = cn({
    'cell__default-size': true,
    cell__spell: type === 'midSpell' || type === 'topSpell',
    'cell__big-spell': type === 'bigSpell',
    cell__field: type === 'field',
    cell__animation_green: animation === 'green',
    cell__animation_red: animation === 'red',
  });

  useEffect(() => {
    if (cardType === 'warrior') {
      const warrior = currentCell.content.find((item) => item.type === 'warrior');
      console.log(warrior);
      if (type === 'field' && warrior && cardSource === 'field') {
        const onMoveSpells = findTriggerSpells(warrior, currentCell, 'onmove', 'warrior');
        onMoveSpells.forEach((spell) => makeFeatureCast(spell, currentCell, warrior));
      }
      if (type === 'field' && warrior && cardSource === 'hand') {
        const onPlaySpells = findTriggerSpells(warrior, currentCell, 'onplay', 'warrior');
        onPlaySpells.forEach((spell) => makeFeatureCast(spell, currentCell, warrior));
      }
    }
    if (cardType === 'spell') {
      const spellCard = currentCell.content.find((item, i) => item.type === 'spell' && i === 0);
      if (spellCard && cardSource === 'field') {
        const onMoveSpells = findTriggerSpells(spellCard, currentCell, 'onmove', 'spell');
        onMoveSpells.forEach((spell) => makeFeatureCast(spell, currentCell, spellCard));
      }
      if (spellCard && cardSource === 'hand') {
        const onPlaySpells = findTriggerSpells(spellCard, currentCell, 'onplay', 'spell');
        onPlaySpells.forEach((spell) => makeFeatureCast(spell, currentCell, spellCard));
      }
    }
  // eslint-disable-next-line
  }, [cardType, contLength, cardSource]);

  const handleCellClick = () => {
    const activeCard = getActiveCard();

    const addCardToField = () => {
      if (activeCard.status === 'hand') {
        const newPoints = currentPoints - activeCard.cost;
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
            <CSSTransition key={item.id} timeout={500} classNames="cardanimation">
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
          <CSSTransition in timeout={500} classNames="cellanimation">
            <button type="button" className="cell__default-btn" aria-label="field cell" onClick={handleCellClick} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};

export default Cell;
