import React, { useEffect, useState } from 'react';


const StravaActivities = () => {
 const [activities, setActivities] = useState(null);
 const [totalDistance, setTotalDistance] = useState(0); // Track total distance (km)
 const [error, setError] = useState(null);
 const [isLoading, setIsLoading] = useState(false); // Track loading state


 const fetchActivities = async () => {
   const accessToken = localStorage.getItem("strava_access_token");
   if (!accessToken) {
     setError("No access token found. Please connect to Strava first.");
     console.error("No access token found in localStorage.");
     return;
   }


   setIsLoading(true); // Start loading
   setError(null); // Clear any previous errors


   try {
     console.log("Fetching activities with access token:", accessToken); // Log the access token


     // Get Unix timestamp for 7 days ago
     const oneWeekAgo = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);


     // Fetch only activities from the past 7 days
     const response = await fetch(
         `https://www.strava.com/api/v3/athlete/activities?after=${oneWeekAgo}`,
         {
           headers: {
             Authorization: `Bearer ${accessToken}`,
           },
         }
     );


     console.log("API Response Status:", response.status); // Log the response status
     if (!response.ok) {
       throw new Error(`Failed to fetch activities: ${response.statusText}`);
     }


     const data = await response.json();
     console.log("Activities Data:", data); // Log the data


     // Calculate total distance in the last 7 days (convert meters to km)
     const totalDist = data.reduce((sum, activity) => sum + activity.distance / 1000, 0);


     setActivities(data);
     setTotalDistance(totalDist.toFixed(2)); // Store the total distance
   } catch (error) {
     console.error("Error fetching activities:", error); // Log the error
     setError(error.message);
   } finally {
     setIsLoading(false); // Stop loading
   }
 };


 useEffect(() => {
   fetchActivities(); // Fetch activities on component mount
 }, []);


 // Helper function to format duration (in seconds) to HH:MM:SS
 const formatDuration = (seconds) => {
   const hours = Math.floor(seconds / 3600);
   const minutes = Math.floor((seconds % 3600) / 60);
   const secs = seconds % 60;
   return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 };


 // Helper function to format average speed (in meters per second) to km/h
 const formatSpeed = (speed) => {
   return (speed * 3.6).toFixed(2); // Convert m/s to km/h
 };


 return (
     <div style={{ textAlign: "center", padding: "20px" }}>
       <h1>🏃‍♂️ Your Strava Activities (Last 7 Days)</h1>


       {error && <p style={{ color: "red" }}>{error}</p>}


       {activities ? (
           <>
             <h2>📏 Total Distance: {totalDistance} km</h2>


             <table border="1" style={{ margin: "auto", marginBottom: "20px" }}>
               <thead>
               <tr>
                 <th>Date</th>
                 <th>Duration</th>
                 <th>Average Speed (km/h)</th>
                 <th>Distance (km)</th>
               </tr>
               </thead>
               <tbody>
               {activities.map((activity) => (
                   <tr key={activity.id}>
                     <td>{new Date(activity.start_date).toLocaleDateString()}</td>
                     <td>{formatDuration(activity.moving_time)}</td>
                     <td>{formatSpeed(activity.average_speed)}</td>
                     <td>{(activity.distance / 1000).toFixed(2)}</td>
                   </tr>
               ))}
               </tbody>
             </table>


             <button onClick={fetchActivities} disabled={isLoading}>
               {isLoading ? "Refreshing..." : "🔄 Refresh Data"}
             </button>
           </>
       ) : (
           <p>Loading activities...</p>
       )}
     </div>
 );
};


export default StravaActivities;
