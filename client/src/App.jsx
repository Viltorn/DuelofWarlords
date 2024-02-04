import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter,
  Navigate,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import LoadScreen from './components/LoadScreen/LoadScreen.jsx';
import ErrorPage from './pages/ErrorPage/ErrorPage.jsx';

const MainPage = lazy(() => import('./pages/MainPage/MainPage.jsx'));
const Battlefield = lazy(() => import('./pages/BattleField/Battlefield.jsx'));
const OnlineLobby = lazy(() => import('./pages/BattleField/Battlefield.jsx'));
const ChooseDeckWindow = lazy(() => import('./pages/ChooseDeck/ChooseDeck.jsx'));
const DeckBuilder = lazy(() => import('./pages/DeckBuilder/DeckBuilder.jsx'));
const ChooseGame = lazy(() => import('./pages/ChooseGame/ChooseGame.jsx'));

const App = () => {
  const { logged } = useSelector((state) => state.gameReducer);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route path="/" element={<MainPage />} />
          <Route path="/battle" element={<Battlefield />} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="/choose" element={<ChooseGame />} />
          <Route path="/lobby" element={logged ? <OnlineLobby /> : <Navigate to="/choose" />} />
          <Route path="/choosedeck" element={logged ? <ChooseDeckWindow /> : <Navigate to="/choose" />} />
          <Route path="/deckbuilder" element={logged ? <DeckBuilder /> : <Navigate to="/choose" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

const Wrapper = () => (
  <Suspense fallback={<LoadScreen />}>
    <Outlet />
  </Suspense>
);

export default App;
