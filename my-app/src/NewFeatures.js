import { useState, useEffect } from "react";


function NewFeatures({ heartbeats, setHeartbeats }) {
   const [multiplier, setMultiplier] = useState(1);
   const [multiplierActive, setMultiplierActive] = useState(false);
   const [goldenHeartVisible, setGoldenHeartVisible] = useState(false);
   const [achievements, setAchievements] = useState([]);
   const [theme, setTheme] = useState("light");


   // Activates 2X Multiplier for 5 minutes after a 30-minute logged activity
   function activateMultiplier() {
       setMultiplier(2);
       setMultiplierActive(true);
       setTimeout(() => {
           setMultiplier(1);
           setMultiplierActive(false);
       }, 300000); // 5 minutes duration
   }


   // Golden Heart spawns randomly and gives bonus heartbeats
   function spawnGoldenHeart() {
       setTimeout(() => {
           setGoldenHeartVisible(true);
           setTimeout(() => setGoldenHeartVisible(false), 5000);
           spawnGoldenHeart();
       }, Math.random() * 30000 + 30000);
   }


   function collectGoldenHeart() {
       setHeartbeats(prev => prev + 500);
       setGoldenHeartVisible(false);
   }


   useEffect(() => {
       spawnGoldenHeart();
   }, []);


   // Achievement System
   useEffect(() => {
       const newAchievements = [];
       if (heartbeats >= 1000) newAchievements.push("🏅 1,000 Heartbeats!");
       if (heartbeats >= 10000) newAchievements.push("🥈 10,000 Heartbeats!");
       if (heartbeats >= 100000) newAchievements.push("🥇 100,000 Heartbeats!");
       setAchievements(newAchievements);
   }, [heartbeats]);


   // Theme Switching
   function toggleTheme() {
       setTheme(prev => (prev === "light" ? "dark" : "light"));
       document.body.style.backgroundColor = theme === "light" ? "#333" : "#fff";
       document.body.style.color = theme === "light" ? "#fff" : "#000";
   }


   return (
       <div>
           {multiplierActive && <h3 style={{ color: "gold" }}>🔥 2X Multiplier Active!</h3>}
           {goldenHeartVisible && <button onClick={collectGoldenHeart}>💛 Golden Heart!</button>}
           <button onClick={toggleTheme}>🎨 Toggle Theme</button>
           <h3>Achievements</h3>
           <ul>
               {achievements.map((achievement, index) => (
                   <li key={index}>{achievement}</li>
               ))}
           </ul>
       </div>
   );
}


export default NewFeatures;
