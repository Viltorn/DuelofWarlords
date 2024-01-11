import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  warnWindow: null,
  activeDeck: null,
  chosenDeckName: null,
  selectedHero: null,
  selectedCards: [],
  isChangesMade: false,
};

const deckbuilderSlice = createSlice({
  name: 'builder',
  initialState,
  reducers: {
    setWarnWindow(state, { payload }) {
      const { windowType } = payload;
      state.warnWindow = windowType;
    },
    setActiveDeck(state, { payload }) {
      const { activeDeck } = payload;
      state.activeDeck = activeDeck;
    },
    setChosenDeck(state, { payload }) {
      const { chosenDeckName } = payload;
      state.chosenDeckName = chosenDeckName;
    },
    selectHero(state, { payload }) {
      const { selectedHero } = payload;
      state.selectedHero = selectedHero;
    },
    selectCards(state, { payload }) {
      const { selectedCards } = payload;
      state.selectedCards = selectedCards;
    },
    setChanges(state, { payload }) {
      const { changesMade } = payload;
      state.isChangesMade = changesMade;
    },
  },
});

export const { actions } = deckbuilderSlice;
export default deckbuilderSlice.reducer;
