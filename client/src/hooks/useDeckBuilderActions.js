import { useDispatch, useSelector } from 'react-redux';
import { actions as modalsActions } from '@slices/modalsSlice.js';
import { actions as deckbuilderActions } from '../slices/deckbuilderSlice.js';
import { actions as battleActions } from '../slices/battleSlice.js';
import { maxCardsDeckCopy } from '../gameData/gameLimits';

const useDeckBuilderActions = () => {
  const dispatch = useDispatch();
  const {
    selectedCards,
  } = useSelector((state) => state.deckbuilderReducer);
  const changeCardQuantity = (card, value) => {
    const initialQty = card.qty ?? 0;
    const newQty = initialQty + value;
    const newCard = { ...card, qty: newQty };
    const removeCard = newQty === 0 && card.type !== 'hero';
    const removeHero = newQty === 0 && card.type === 'hero';
    const addNewCard = card.qty === 0 && newQty === 1 && card.type !== 'hero';
    const changeCardQty = newQty !== 0 && card.type !== 'hero';
    const addHero = newQty !== 0 && card.type === 'hero';

    if (removeCard) {
      const newSelectedCards = selectedCards.filter((el) => el.description !== card.description);
      dispatch(deckbuilderActions.selectCards({ selectedCards: newSelectedCards }));
    } else if (removeHero) {
      dispatch(deckbuilderActions.selectHero({ selectedHero: null }));
      dispatch(deckbuilderActions.selectCards({ selectedCards: [] }));
    } else if (addNewCard) {
      dispatch(deckbuilderActions.selectCards({ selectedCards: [...selectedCards, newCard] }));
    } else if (changeCardQty) {
      const index = selectedCards.findIndex((el) => el.description === card.description);
      const newSelectedCards = [...selectedCards];
      newSelectedCards[index] = newCard;
      dispatch(deckbuilderActions.selectCards({ selectedCards: newSelectedCards }));
    } else if (addHero) {
      console.log(newCard);
      dispatch(deckbuilderActions.selectHero({ selectedHero: newCard }));
    }

    if (removeCard || removeHero || addHero) {
      dispatch(battleActions.deleteActiveCard({ player: 'player1' }));
    }

    if (addNewCard || changeCardQty) {
      dispatch(battleActions.addActiveCard({ card: newCard, player: 'player1' }));
    }
    dispatch(modalsActions.openModal({ type: 'activeCardWindow', data: newCard }));
  };

  const changeCardsInDeckBuilder = (card, value, cardsLimitReached) => {
    if (value === 1 && card.qty < maxCardsDeckCopy && !cardsLimitReached) {
      changeCardQuantity(card, 1);
      dispatch(deckbuilderActions.setChanges({ changesMade: true }));
    }
    if (value === -1) {
      changeCardQuantity(card, -1);
      dispatch(deckbuilderActions.setChanges({ changesMade: true }));
    }
  };

  return { changeCardsInDeckBuilder };
};

export default useDeckBuilderActions;
