// src/routes/logo.js
import React from 'react';
import './logo.css';
import ThemeToggle from '../components/ThemeToggle';

const Logo = ({ redirectToStrava, theme, toggleTheme }) => {
  return (
    <div className="logo-container">
      <div className="content-wrapper">
        <div className="header-content">
          <div className="logo-text">
            Health Clicker
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <button 
              onClick={redirectToStrava}
              className="strava-button"
            >
              Login with Strava
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Logo;