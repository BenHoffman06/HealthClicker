// src/routes/logo.js
import React from 'react';
import './logo.css';
import { Sun, Moon } from 'lucide-react';


const Logo = ({ redirectToStrava, theme, toggleTheme }) => {
  return (
    <div className="logo-container">
      <div className="content-wrapper">
        <div className="header-content">
          <div className="logo-text">
            Health Clicker
          </div>
          <div className="flex items-center gap-4">
            
          <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="theme-icon" />
      ) : (
        <Sun className="theme-icon" />
      )}
    </button>
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