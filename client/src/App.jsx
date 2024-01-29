import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';
import MainPage from './pages/MainPage/MainPage.jsx';
import Battlefield from './pages/BattleField/Battlefield.jsx';
import ChooseGame from './pages/ChooseGame/ChooseGame.jsx';
import OnlineLobby from './pages/OnlineLobby/OnlineLobby.jsx';
import ChooseDeckWindow from './pages/ChooseDeck/ChooseDeck.jsx';
import DeckBuilder from './pages/DeckBuilder/DeckBuilder.jsx';

const App = () => {
  const { logged } = useSelector((state) => state.gameReducer);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/battle" element={<Battlefield />} />
        <Route path="*" element={<ErrorPage />} />
        <Route path="/choose" element={<ChooseGame />} />
        <Route path="/lobby" element={logged ? <OnlineLobby /> : <Navigate to="/choose" />} />
        <Route path="/choosedeck" element={logged ? <ChooseDeckWindow /> : <Navigate to="/choose" />} />
        <Route path="/deckbuilder" element={logged ? <DeckBuilder /> : <Navigate to="/choose" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
