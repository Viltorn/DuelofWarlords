import { useContext } from 'react';
import functionsContext from '../contexts/functionsContext';

const useFunctionsContext = () => {
  const context = useContext(functionsContext);
  if (!context) {
    throw new Error('useFunctionsContext must be used within an FunctionsProvider');
  }
  return context;
};

export default useFunctionsContext;
