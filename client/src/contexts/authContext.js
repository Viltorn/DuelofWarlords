import { createContext } from 'react';
import getAuthToken from '../utils/getAuthToken.js';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const isLogged = () => {
    if (getAuthToken()) {
      return true;
    }
    return false;
  };

  const logIn = (data) => {
    localStorage.setItem('greenApiUser', JSON.stringify(data));
  };
  const logOut = () => {
    localStorage.removeItem('greenApiUser');
  };

  return (
    <AuthContext.Provider value={{
      logIn,
      logOut,
      isLogged,
    }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
