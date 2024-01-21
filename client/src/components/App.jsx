import React from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import ErrorPage from './ErrorPage/ErrorPage.jsx';
import MainPage from './MainPage/MainPage.jsx';
import Battlefield from './BattleField/Battlefield.jsx';
import ChooseGame from './ChooseGame/ChooseGame.jsx';
import OnlineLobby from './OnlineLobby/OnlineLobby.jsx';
import ChooseDeckWindow from './DeckBuilder/ChooseDeckWindow.jsx';
import DeckBuilder from './DeckBuilder/DeckBuilder.jsx';

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
