import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';

const AverageFPS = () => {
  const [avgFps, setAvgFps] = useState(null);

  useEffect(() => {
    const fetchAvgFps = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-avg-fps-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch average FPS data');
        }

        const result = await response.json();
        const fpsData = result['AVG FPS']; // Array of FPS data
        const totalFps = fpsData.reduce((acc, item) => acc + item.AverageFPS, 0); // Sum up FPS values
        const avgFpsValue = totalFps / fpsData.length; // Calculate average FPS

        setAvgFps(avgFpsValue); // Set the average FPS
      } catch (error) {
        console.error('Error fetching average FPS:', error);
      }
    };

    fetchAvgFps();
  }, []);

  if (avgFps === null) {
    return <Typography>Loading...</Typography>; // Show loading text while fetching
  }

  return (
    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
      {avgFps.toFixed(2)}
    </Typography>
  );
};

export default AverageFPS;
