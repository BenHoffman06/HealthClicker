// src/components/ThemeToggle.js
import React from 'react';
import { Sun, Moon } from 'lucide-react';

const ThemeToggle = ({ theme, toggleTheme }) => {
  return (
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

  );
};

export default ThemeToggle;