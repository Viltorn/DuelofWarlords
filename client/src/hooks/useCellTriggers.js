import { useSelector } from 'react-redux';
import findTriggerSpells from '../utils/supportFunc/findTriggerSpells.js';
import useBattleActions from './useBattleActions.js';
import useAITurn from './useAITurn.js';

const useCellTriggers = () => {
  const { players, gameTurn } = useSelector((state) => state.battleReducer);
  // const store = useStore();
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
    } else {
      onTriggerSpells
        .forEach((spell) => {
          // const currentFieldCards = store.getState().battleReducer.fieldCards;
          // const currentCard = currentFieldCards.find((c) => c.cellId === thisCell.id);
          // if (!currentCard) return;
          makeFeatureCast({
            feature: spell,
            aimCell: thisCell,
            applyingCard: card,
            player: spell.player,
            player2Type,
            performAIAction,
          });
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
