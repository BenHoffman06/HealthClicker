import React, { useState } from 'react';

function Upgrade({ title, description, price, unlockPrice, img, color }) {
    const [unlocked, setUnlocked] = useState(false);

    const redirectToStrava = () => {
        const clientId = "149755";
        const redirectUri = "http://localhost:3000/callback";
        const scope = "activity:read";
        const responseType = "code";

        const authUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}`;

        window.location.href = authUrl;
    };

    const handleUnlock = () => {
        setUnlocked(true);
    };

    return (
        <div className="upgrade-container" onClick={handleUnlock} style={{ backgroundColor: color }}>
            <img src={img}></img>
            <div className='upgrade'>
                <h3 className='title'>{title}</h3>
                <p className='description'>{description}</p>
                {unlocked ? (
                    <p className="unlock-price">{price}</p>
                ) : (
                    <p className="unlock-price" style={{ color: 'red' }}>Unlock Price: ${unlockPrice}</p>
                )}  
            </div>
        </div>
    );
}

export default Upgrade;
