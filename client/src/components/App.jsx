import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import ErrorPage from './ErrorPage.jsx';
import MainPage from './MainPage/MainPage.jsx';
import Battlefield from './Battlefield.jsx';
import ChooseGame from './ChooseGame/ChooseGame.jsx';
import HotSeatMenu from './HotSeatMenu/HotSeatStartMenu.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/hotseat" element={<Battlefield />} />
      <Route path="/hotseatmenu" element={<HotSeatMenu />} />
      <Route path="*" element={<ErrorPage />} />
      <Route path="/choose" element={<ChooseGame />} />
    </Routes>
  </BrowserRouter>
);

export default App;
