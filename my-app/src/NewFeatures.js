import { useState, useEffect } from "react";


function NewFeatures({ heartbeats, setHeartbeats, getTotalBPS, accessToken }) {
   const [multiplier, setMultiplier] = useState(1);
   const [goldenHeartVisible, setGoldenHeartVisible] = useState(false);
   const [achievements, setAchievements] = useState([]);
   const [theme, setTheme] = useState("light");
   const [streak, setStreak] = useState(0);
   const [lastActivityDate, setLastActivityDate] = useState(localStorage.getItem("lastActivityDate") || "");
   const [challenge, setChallenge] = useState(null);
   const [challengeEndTime, setChallengeEndTime] = useState(null);
   const [lastCheckedActivity, setLastCheckedActivity] = useState(null);
   const [lastActivityTime, setLastActivityTime] = useState(null);


   const challengeList = [
       { text: "Log a 5-minute activity within the next hour to earn a 5x BPS multiplier for 1 minute!", duration: 60, reward: 5 },
       { text: "Walk 1 km in the next hour for a 3x BPS multiplier for 2 minutes!", duration: 60, reward: 3 },
       { text: "Complete any Strava activity in the next 30 minutes for a 4x BPS multiplier for 3 minutes!", duration: 30, reward: 4 },
       { text: "Log a 15-minute activity to earn a 6x BPS multiplier for 90 seconds!", duration: 90, reward: 6 },
       { text: "Run or cycle for 2 km within the next 45 minutes to earn a 2x BPS multiplier for 5 minutes!", duration: 45, reward: 2 },
   ];


   useEffect(() => {
       if (!challenge) {
           startNewChallenge();
       }
   }, [challenge]);


   useEffect(() => {
       checkForNewStravaActivity();
   }, [lastActivityTime]);


   function startNewChallenge() {
       const newChallenge = challengeList[Math.floor(Math.random() * challengeList.length)];
       setChallenge(newChallenge);
       setChallengeEndTime(Date.now() + newChallenge.duration * 60 * 1000);
   }


   async function checkForNewStravaActivity() {
       if (!accessToken) return;
       try {
           const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
               headers: { Authorization: `Bearer ${accessToken}` }
           });
           const activities = await response.json();
           if (activities.length > 0) {
               const latestActivityTime = new Date(activities[0].start_date).getTime();
               if (!lastActivityTime || latestActivityTime > lastActivityTime) {
                   setLastActivityTime(latestActivityTime);
                   completeChallenge();
               }
           }
       } catch (error) {
           console.error("Error fetching Strava activities:", error);
       }
   }


   function validateChallengeCompletion(activity) {
       if (!challenge) return false;
       const { minDuration, minDistance } = challenge;
       if (minDuration && activity.moving_time < minDuration) return false;
       if (minDistance && activity.distance < minDistance) return false;
       return true;
   }


   function completeChallenge() {
       if (!challenge) return;
       setMultiplier(challenge.reward);
       setTimeout(() => {
           setMultiplier(1);
           startNewChallenge(); // Start a new challenge immediately after completion
       }, 60 * 1000);
       setChallenge(null);
   }


   async function checkForNewStravaActivity() {
       if (!accessToken || !challenge) return;
       try {
           const response = await fetch("https://www.strava.com/api/v3/athlete/activities", {
               headers: { Authorization: `Bearer ${accessToken}` }
           });
           const activities = await response.json();
           if (activities.length > 0) {
               const latestActivity = activities[0];
               const latestActivityTime = new Date(latestActivity.start_date).getTime();


               if (!lastCheckedActivity || latestActivityTime > lastCheckedActivity) {
                   setLastCheckedActivity(latestActivityTime);
                   if (validateChallengeCompletion(latestActivity)) {
                       completeChallenge();
                   }
               }
           }
       } catch (error) {
           console.error("Error fetching Strava activities:", error);
       }
   }


   function checkStreak() {
       const today = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format


       if (lastActivityDate === today) {
           return; // Streak already counted for today
       }


       const yesterday = new Date();
       yesterday.setDate(yesterday.getDate() - 1);
       const yesterdayStr = yesterday.toISOString().split("T")[0];


       if (lastActivityDate === yesterdayStr) {
           setStreak(prev => prev + 1); // Continue streak
       } else {
           setStreak(1); // Reset streak if a day was missed
       }


       localStorage.setItem("lastActivityDate", today);
       setLastActivityDate(today);
       applyStreakBonus();
   }


   function applyStreakBonus() {
       let bonusMultiplier = 1;


       if (streak >= 1) bonusMultiplier = 1.5;  // 1-day streak → 1.5x boost
       if (streak >= 7) bonusMultiplier = 2;    // 7-day streak → 2x boost
       if (streak >= 30) bonusMultiplier = 5;   // 30-day streak → 5x boost


       setMultiplier(bonusMultiplier);
   }


   // Activates 2X Multiplier for 5 minutes after a 30-minute logged activity
   function activateMultiplier() {
       setMultiplier(2);
       setTimeout(() => {
           setMultiplier(1);
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
       setHeartbeats(prev => prev + getTotalBPS() * 10); // Reward is 10x the BPS
       setGoldenHeartVisible(false);
   }


   useEffect(() => {
       spawnGoldenHeart();
   }, []);


   // Achievement System
   useEffect(() => {
    updateAchievements();
 }, [heartbeats]);
 
 
 function updateAchievements() {
    const newAchievements = [...achievements];
    if (!newAchievements.includes("🏅 1,000 Heartbeats!") && heartbeats >= 1000) newAchievements.push("🏅 1,000 Heartbeats!");
    if (!newAchievements.includes("🥈 10,000 Heartbeats!") && heartbeats >= 10000) newAchievements.push("🥈 10,000 Heartbeats!");
    if (!newAchievements.includes("🥇 100,000 Heartbeats!") && heartbeats >= 100000) newAchievements.push("🥇 100,000 Heartbeats!");
    if (!newAchievements.includes("🏆 1,000,000 Heartbeats!") && heartbeats >= 1000000) newAchievements.push("🏆 1,000,000 Heartbeats!");
 
 
    if (JSON.stringify(newAchievements) !== JSON.stringify(achievements)) {
        setAchievements(newAchievements);
        localStorage.setItem("achievements", JSON.stringify(newAchievements));
    }
 }
 
 


   // Theme Switching
   function toggleTheme() {
       setTheme(prev => (prev === "light" ? "dark" : "light"));
       document.body.style.backgroundColor = theme === "light" ? "#333" : "#fff";
       document.body.style.color = theme === "light" ? "#fff" : "#000";
   }
   window.completeChallenge = completeChallenge;
   window.startNewChallenge = startNewChallenge;
   window.toggleTheme = toggleTheme;
   window.setGoldenHeartVisible = setGoldenHeartVisible;
   window.collectGoldenHeart = collectGoldenHeart;
   window.applyStreakBonus = applyStreakBonus;
   window.setStreak = setStreak;
   window.setAchievements = setAchievements;
   
   

   return (
    <div>
        {multiplier > 1 && <h3 style={{ color: "gold" }}>🔥 {multiplier}X Multiplier Active!</h3>}
        {goldenHeartVisible && <button onClick={collectGoldenHeart}>💛 Golden Heart!</button>}
        {/* Achievements Box */}
        <div style={{
            padding: "10px",
            backgroundColor: theme === "light" ? "#f9f9f9" : "#663737",
            color: theme === "light" ? "#000" : "#fff",
            borderRadius: "10px",
            marginTop: "10px",
            textAlign: "center",
            width: "300px"
        }}>
            <h3>🏅 Achievements</h3>
            <ul>
                {achievements.map((achievement, index) => (
                    <li key={index}>{achievement}</li>
                ))}
            </ul>
        </div>
        {/* Challenge Box */}
        {challenge && (
            <div style={{
                padding: "10px",
                backgroundColor: theme === "light" ? "#f9f9f9" : "#663737",
                color: theme === "light" ? "#000" : "#fff",
                borderRadius: "10px",
                marginTop: "10px"
            }}>
                <h3>🏆 Challenge Active!</h3>
                <p>{challenge.text}</p>
                <p>⏳ Time Left: {Math.max(0, Math.floor((challengeEndTime - Date.now()) / 1000 / 60))} min</p>
                <p>🔄 Log a Strava activity to complete this challenge!</p>
            </div>
        )}
        {/* Streak Tracker Box */}
        <div style={{
            padding: "10px",
            backgroundColor: theme === "light" ? "#f9f9f9" : "#663737",
            color: theme === "light" ? "#000" : "#fff",
            borderRadius: "10px",
            marginTop: "10px"
        }}>
            <h3>🔥 Streak Tracker</h3>
            <p>📅 Current Streak: {streak} days</p>
            <p>📈 Streak Bonus: x{multiplier.toFixed(1)} BPS</p>
        </div>
    </div>
);

}


export default NewFeatures;