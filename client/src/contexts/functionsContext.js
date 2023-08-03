import { createContext } from 'react';
import { useDispatch, useStore } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();
  const store = useStore();

  const deleteCardfromSource = (card) => {
    const { player, status, cellId } = card;
    const cardId = card.id;
    switch (status) {
      case 'hand':
        dispatch(battleActions.deleteHandCard({ cardId, player }));
        break;
      case 'field':
        dispatch(battleActions.deleteFieldCard({ cardId, cellId }));
        break;
      default:
        break;
    }
  };

  const getActiveCard = () => {
    const { activeCardPlayer1, activeCardPlayer2, thisPlayer } = store.getState().battleReducer;
    return thisPlayer === 'player1' ? activeCardPlayer1 : activeCardPlayer2;
  };

  return (
    <FunctionContext.Provider value={{
      deleteCardfromSource,
      getActiveCard,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
