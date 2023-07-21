import { createContext } from 'react';
import { useDispatch } from 'react-redux';
import { actions as battleActions } from '../slices/battleSlice.js';

const FunctionContext = createContext({});

export const FunctionProvider = ({ children }) => {
  const dispatch = useDispatch();

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

  return (
    <FunctionContext.Provider value={{
      deleteCardfromSource,
    }}
    >
      {children}
    </FunctionContext.Provider>
  );
};

export default FunctionContext;
