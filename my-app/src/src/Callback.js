import React, { useEffect } from 'react';

const Callback = () => {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const authCode = urlParams.get("code");

    if (authCode) {
      getStravaAccessToken(authCode);
    } else {
      console.log("No authorization code found");
    }
  }, []);

  const getStravaAccessToken = async (authCode) => {
    const response = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: "149755",
        client_secret: "e4e1abd587f4e533db86feefb7743cd2793fe831",    
        code: authCode,
        grant_type: "authorization_code"
      })
    });

    const data = await response.json();

    if (data.access_token) {
      console.log("Access Token:", data.access_token);
      localStorage.setItem("strava_access_token", data.access_token); // Store for later use
      window.location.href = "/"; // Redirect to home page or another route
    } else {
      console.error("Failed to get access token", data);
    }
  };

  return (
    <div>
      <p>Loading...</p>
    </div>
  );
};

export default Callback;