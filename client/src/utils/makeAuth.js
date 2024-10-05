import axios from 'axios';
import routes from '../api/routes.js';
import standartDecks from '../gameCardsData/standardDecks/standartDecks.js';

const makeAuth = async (username, password, type) => {
  if (type === 'logIn') {
    const res = await axios.get(routes.getAuth('auth'), { headers: { username, password } });
    return res;
  }
  if (type === 'signUp') {
    const res = await axios.post(routes.getAuth('auth'), { username, password, decks: standartDecks });
    return res;
  }
  return null;
};

export default makeAuth;
