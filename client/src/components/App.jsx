import React from 'react';
import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import ErrorPage from './error-page.jsx';
// import Header from './Header.jsx';
import MainPage from './MainPage.jsx';
import Battlefield from './Battlefield.jsx';

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/battle" element={<Battlefield />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
