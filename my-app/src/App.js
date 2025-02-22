import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import './App.css';
import Callback from './Callback';
import Home from './Home'; // Ensure this component exists
import StravaActivities from './StravaActivities'; // Ensure this component exists
import Upgrade from './Upgrade';

import heartImage from './/images/heart.jpg';

function App() {
  const redirectToStrava = () => {
    const clientId = "149755"; 
    const redirectUri = "http://localhost:3000/callback"; // Must match your Strava settings
    const scope = "activity:read_all"; // Permission to read activities
    const responseType = "code"; // Required for OAuth
  
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
    window.location.href = authUrl; // Redirect the user
  };

  return (
    <div className="App">
      <div className='top'>
        <div className="left">
          <h1>Health Clicker</h1>
        </div>
        <div className="center">
          <h2>Heartbeats: <span id="hb-counter"></span></h2> 
          <h2>Beats per second: <span id="bps-counter"></span></h2> 
          <img src={heartImage} alt="Heart" /> 
        </div>
        <div className="right">
          <h1>Upgrades</h1>
          <Upgrade></Upgrade>
          <Upgrade></Upgrade>
          <Upgrade></Upgrade>
          <Upgrade></Upgrade>
          <Upgrade></Upgrade>
        </div>
      </div>
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/callback" element={<Callback />} />
        <Route path="/activities" element={<StravaActivities />} />
      </Routes>
      <StravaActivities></StravaActivities>
      <button onClick={redirectToStrava}>Connect to Strava</button>
    </div>
  );
}

export default App;