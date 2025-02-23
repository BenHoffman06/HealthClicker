import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import Callback from './Callback';
import Home from './Home';
import StravaActivities from './StravaActivities';
import HeartClicker from './HeartClicker';
import Logo from './routes/logo';
import ThemeToggle from './components/ThemeToggle'; // You'll need to create this file

function App() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.style.backgroundColor = newTheme === "dark" ? "#333" : "#fff";
    document.body.style.color = newTheme === "dark" ? "#fff" : "#000";
    document.documentElement.classList.toggle("dark");
  };

  const redirectToStrava = () => {
    const clientId = "149755";
    const redirectUri = "http://localhost:3000/callback";
    const scope = "activity:read_all";
    const responseType = "code";
    
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
    
    window.location.href = authUrl;
  };

  return (
    <div className={`App ${theme}`}>
      <div className='top'>
        <Logo 
          redirectToStrava={redirectToStrava} 
          theme={theme} 
          toggleTheme={toggleTheme}
        />
        <div className="center">
          <HeartClicker />
        </div>
      </div>
      
      <Routes>
        <Route path="/callback" element={<Callback />} />
        <Route path="/activities" element={<StravaActivities />} />
      </Routes>
    </div>
  );
}

export default App;