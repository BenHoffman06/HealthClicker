import { useState, useEffect } from "react";
import NewFeatures from "./NewFeatures";
import heartImage from './images/heart.jpg';
import goldHeartImage from './images/goldHeart.png';
import normalHeartImage from './images/normalHeart.png';

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
    const [multiplier, setMultiplier] = useState(1);
    const [multiplierActive, setMultiplierActive] = useState(false);
    const [isGoldenHeartActive, setIsGoldenHeartActive] = useState(false); // New state variable

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

    function getTotalBPS() {
        return Object.keys(upgrades).reduce((total, upgrade) => {
            return total + (upgrades[upgrade] * baseUpgradeCosts[upgrade].bps);
        }, 0);
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

    // Function to toggle golden heart
    const toggleGoldenHeart = () => {
        setIsGoldenHeartActive(prev => !prev);
    };

    // Expose functions globally for testing
    window.toggleGoldHeart = toggleGoldenHeart;
    window.setHeartbeats = setHeartbeats;
    window.setRealLifeDistance = setRealLifeDistance;
    window.setUpgrades = setUpgrades;
    window.setMultiplier = setMultiplier;
    window.getTotalBPS = getTotalBPS;

    return (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", padding: "20px" }}>
            {/* Left Section - Heart Counter & Clicker */}
            <div style={{ textAlign: "center", flex: 1 }}>
                <h1 className="purple">❤️ Heartbeats: {heartbeats.toFixed(0)}</h1>
                <h2 className="purple">📏 Distance Multiplier: {realLifeDistance} km</h2>

                <img
                    src={isGoldenHeartActive ? goldHeartImage : normalHeartImage} // Change image based on state
                    alt="Heart"
                    onClick={() => {
                        setHeartbeats(prev => prev + 1 * (multiplierActive ? 2 : 1));
                    }}
                    style={{
                        width: "150px",
                        height: "150px",
                        cursor: "pointer",
                        transition: "transform 0.1s"
                    }}
                    onMouseDown={(e) => e.target.style.transform = "scale(0.9)"}
                    onMouseUp={(e) => e.target.style.transform = "scale(1)"}
                />

                {multiplierActive && <h3 style={{ color: "gold" }}>🔥 2X Multiplier Active!</h3>}
x
                <NewFeatures
                    heartbeats={heartbeats}
                    setHeartbeats={setHeartbeats}
                    getTotalBPS={getTotalBPS}
                    setMultiplier={setMultiplier}
                    multiplierActive={multiplierActive}
                    accessToken={accessToken}
                />
            </div>

            {/* Fixed right section with 2-column upgrade grid */}
            <div className="fixed-upgrades">
                <h2>Upgrades</h2>
                <div className="upgrades-grid">
                    {Object.keys(upgrades).map(upgrade => (
                        <div key={upgrade} className="upgrade-card">
                            <h3>{baseUpgradeCosts[upgrade].icon} {upgrade.charAt(0).toUpperCase() + upgrade.slice(1)}</h3>
                            <p>Owned: {upgrades[upgrade]}</p>
                            <p>Beats per Second: {(baseUpgradeCosts[upgrade].bps * upgrades[upgrade]).toFixed(1)}</p>
                            <p>Cost to Unlock: {getUpgradeCost(upgrade).toFixed(0)} beats</p>
                            <p>Required Distance: {baseUpgradeCosts[upgrade].km} km</p>
                            <button 
                                className="buy-button"
                                onClick={() => buyUpgrade(upgrade)}
                                disabled={heartbeats < getUpgradeCost(upgrade) || realLifeDistance < baseUpgradeCosts[upgrade].km}
                            >
                                Buy
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default HeartClicker;