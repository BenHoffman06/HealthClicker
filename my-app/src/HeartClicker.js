import { useState, useEffect } from "react";
import heartImage from './/images/heart.jpg';

function HeartClicker() {
   const [heartbeats, setHeartbeats] = useState(0);
   const [realLifeDistance, setRealLifeDistance] = useState(0);
   const [accessToken, setAccessToken] = useState(localStorage.getItem("strava_access_token"));
   const [activities, setActivities] = useState([]);
   const [showActivities, setShowActivities] = useState(false);
   const [upgrades, setUpgrades] = useState({
       autoStepper: 0,
       situps: 0,
       squats: 0,
       pushups: 0,
       planks: 0,
       sprints: 0,
   });
   let bps = 0;
   const baseUpgradeCosts = {
       autoStepper: { beats: 15, km: 1, bps: 0.1, icon: "🚶" },
       situps: { beats: 100, km: 5, bps: 0.5, icon: "🤸" },
       squats: { beats: 1100, km: 10, bps: 8, icon: "🏋️" },
       pushups: { beats: 12000, km: 20, bps: 47, icon: "💪" },
       planks: { beats: 130000, km: 30, bps: 260, icon: "🧘" },
       sprints: { beats: 1400000, km: 50, bps: 1400, icon: "🏃" },
   };


   function getUpgradeCost(upgrade) {
       return Math.ceil(baseUpgradeCosts[upgrade].beats * (1.15 ** upgrades[upgrade]));
   }


   useEffect(() => {
       fetchStravaDistance();
   }, [accessToken]);


   useEffect(() => {
       const interval = setInterval(() => {
           let totalBeats = 0;
           Object.keys(upgrades).forEach(upgrade => {
               totalBeats += upgrades[upgrade] * baseUpgradeCosts[upgrade].bps;
           });
           setHeartbeats(prev => prev + totalBeats / 10);
       }, 100);
       return () => clearInterval(interval);
   }, [upgrades]);


   function buyUpgrade(upgrade) {
       const cost = getUpgradeCost(upgrade);
       const requiredDistance = baseUpgradeCosts[upgrade].km;


       if (heartbeats >= cost && realLifeDistance >= requiredDistance) {
           setHeartbeats(prev => prev - cost);
           setUpgrades(prev => ({ ...prev, [upgrade]: prev[upgrade] + 1 }));
       } else {
           alert(`Not enough heartbeats or distance! You need ${cost.toFixed(0)} heartbeats and ${requiredDistance} km.`);
       }
   }


   function connectToStrava() {
       const clientId = "149755";
       const redirectUri = "http://localhost:3000/callback";
       const scope = "activity:read_all";


       const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;


       window.location.href = authUrl;
   }


   async function fetchStravaDistance() {
       if (!accessToken) return;
       try {
           const oneWeekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);
           const response = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${oneWeekAgo}`, {
               headers: { Authorization: `Bearer ${accessToken}` }
           });
           const data = await response.json();
           const filteredActivities = data.filter(activity => new Date(activity.start_date).getTime() >= oneWeekAgo);
           setActivities(filteredActivities);


           let totalDistance = filteredActivities.reduce((sum, activity) => sum + activity.distance / 1000, 0);
           setRealLifeDistance(totalDistance.toFixed(2));
           localStorage.setItem("totalDistance", totalDistance.toFixed(2));
       } catch (error) {
           console.error("Error fetching Strava activities:", error);
       }
   }


   return (
       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", padding: "20px" }}>
           <div style={{ textAlign: "center", flex: 1 }}>
               <h1>❤️ Heartbeats: {heartbeats.toFixed(0)}</h1>
               <h2>📏 Distance Multiplier: {realLifeDistance} km</h2>
               <h2>⌚ Beats per Second: {bps} </h2>
               <img 
                    src= {heartImage}  // Replace with your image path
                    alt="Heart"
                    onClick={() => setHeartbeats(prev => prev + 1)}
                    style={{
                        width: "150px",
                        height: "150px",
                        cursor: "pointer",
                        transition: "transform 0.1s"
                    }}
                    onMouseDown={(e) => e.target.style.transform = "scale(0.9)"}
                    onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                    
                />

               <h2>Welcome to Health Clicker</h2>
               {!accessToken ? (
                   <button onClick={connectToStrava}>
                       🔗 Connect to Strava
                   </button>
               ) : (
                   <p>✅ Connected to Strava</p>
               )}
           </div>
           <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
               <h2 style={{ gridColumn: "span 2", textAlign: "center" }}>Upgrades</h2>
               {Object.keys(upgrades).map(upgrade => (
                   <div key={upgrade} style={{ textAlign: "left", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>
                       <h3>{baseUpgradeCosts[upgrade].icon} {upgrade.charAt(0).toUpperCase() + upgrade.slice(1)}</h3>
                       <p style={{ fontStyle: "italic" }}>Owned: {upgrades[upgrade]}</p>
                       <p style={{ fontStyle: "italic" }}>Beats per Second: {(baseUpgradeCosts[upgrade].bps * upgrades[upgrade]).toFixed(1)}</p>
                       <p style={{ fontStyle: "italic" }}>Cost to Unlock: {getUpgradeCost(upgrade).toFixed(0)} beats</p>
                       <p style={{ fontStyle: "italic" }}>Required Distance: {baseUpgradeCosts[upgrade].km} km</p>
                       <button onClick={() => buyUpgrade(upgrade)}>Buy</button>
                   </div>
               ))}
           </div>
       </div>
   );
}


export default HeartClicker;

