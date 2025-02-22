import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import './App.css';
import Callback from './Callback';
import Home from './Home'; // Ensure this component exists
import StravaActivities from './StravaActivities'; // Ensure this component exists

function Upgrade() {
  const redirectToStrava = () => {
    const clientId = "149755"; 
    const redirectUri = "http://localhost:3000/callback"; // Must match your Strava settings
    const scope = "activity:read"; // Permission to read activities
    const responseType = "code"; // Required for OAuth
  
    const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;
  
    window.location.href = authUrl; // Redirect the user
  };

  return (
      <div className="upgrade">
        <h3 className='title'>AutoStepper</h3>
        <p className='description'>Description</p>
        <p className="price">Price</p>
      </div>
  );

}
export default Upgrade;