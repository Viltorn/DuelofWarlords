/* eslint-disable max-len */
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { actions as battleActions } from '../slices/battleSlice.js';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import useBattleActions from './useBattleActions.js';
import useAITurn from './useAITurn.js';

const useCellTriggers = () => {
  const { players, gameTurn, fieldCards } = useSelector((state) => state.battleReducer);
  const dispatch = useDispatch();
  const player2Type = players.player2.type;

  const {
    makeFeatureCast,
  } = useBattleActions();

  const {
    performAIAction,
  } = useAITurn();

  const playTriggers = (card, thisCell, spellType, cardclass) => {
    const onTriggerSpells = findTriggerSpells(card, thisCell, spellType, cardclass, gameTurn);
    const returnSpell = onTriggerSpells.find((spell) => spell.name === 'return');
    if (returnSpell) {
      makeFeatureCast({
        feature: returnSpell,
        aimCell: thisCell,
        applyingCard: card,
        player: returnSpell.player,
        player2Type,
        performAIAction,
      });
      const returnSpellCard = fieldCards.find((c) => c.id === returnSpell.id);
      const returnCardFeature = returnSpellCard.school ?? returnSpellCard.faction;
      const aimData = { warCard: true, cardName: card.description, cardsFeature: card.faction };
      dispatch(battleActions.addActionToLog({
        playedCard: { warCard: true, cardName: returnSpellCard.description, cardsFeature: returnCardFeature },
        aim: aimData,
        id: _.uniqueId(),
      }));
    } else {
      onTriggerSpells
        .forEach((spell, i) => {
          makeFeatureCast({
            feature: spell,
            aimCell: thisCell,
            applyingCard: card,
            player: spell.player,
            player2Type,
            performAIAction,
          });
          const spellCard = fieldCards.find((c) => c.id === spell.id);
          const spellCardFeature = spellCard.school ?? spellCard.faction;
          const aimData = { warCard: true, cardName: card.description, cardsFeature: card.faction };
          if (onTriggerSpells[i - 1]?.id !== spell.id) {
            dispatch(battleActions.addActionToLog({
              playedCard: { warCard: true, cardName: spellCard.description, cardsFeature: spellCardFeature },
              aim: aimData,
              id: _.uniqueId(),
            }));
          }
        });
    }
  };

  const checkTriggers = ({
    cardType, cardSource, currentCell, cellContent, cellType,
  }) => {
    if (cardType === 'warrior') {
      const warrior = cellContent.find((item) => item.type === 'warrior');
      if (cellType === 'field' && warrior && cardSource === 'field') {
        playTriggers(warrior, currentCell, 'onmove', 'warrior');
      }
      if (cellType === 'field' && warrior && (cardSource === 'hand' || cardSource === 'postponed')) {
        playTriggers(warrior, currentCell, 'onplay', 'warrior');
      }
    }
    if (cardType === 'spell') {
      const spellCard = cellContent.find((item, i) => item.type === 'spell' && i === 0);
      if (spellCard && cardSource === 'field') {
        const onMoveSpells = findTriggerSpells(spellCard, currentCell, 'onmove', 'spell', gameTurn);
        onMoveSpells.forEach((spell) => {
          makeFeatureCast({
            feature: spell,
            aimCell: currentCell,
            applyingCard: spellCard,
            player: spellCard.player,
            player2Type,
            performAIAction,
          });
        });
      }
      if (spellCard && (cardSource === 'hand')) {
        const onPlaySpells = findTriggerSpells(spellCard, currentCell, 'onplay', 'spell', gameTurn);
        onPlaySpells.forEach((spell) => {
          makeFeatureCast({
            feature: spell,
            aimCell: currentCell,
            applyingCard: spellCard,
            player: spellCard.player,
            player2Type,
            performAIAction,
          });
        });
      }
    }
  };

  return { checkTriggers };
};
export default useCellTriggers;
