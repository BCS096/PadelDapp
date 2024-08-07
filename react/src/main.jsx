import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Web3Provider } from './Web3Provider.jsx';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainClubPage from './clubPage/mainClubPage.jsx';
import MainPlayerPage from './playerPage/MainPlayerPage.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    
      <Router>
      <Web3Provider>
        <Routes>
          <Route path="/home" element={<App />} />
          <Route path="/club/*" element={<MainClubPage />} />
          <Route path="/jugador/*" element={<MainPlayerPage />} />
          <Route path="*" element={<Navigate to="/home" />} />
        </Routes>
        </Web3Provider>
      </Router>
    
  </React.StrictMode>
);
