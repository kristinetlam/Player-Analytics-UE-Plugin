import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import { motion } from 'framer-motion';


const PlayerLocation = () => {
  const [locData, setLocData] = useState(null);

  useEffect(() => {
    const fetchLocData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-position-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch player location data');
        }

        const data = await response.json();

        // Group by ID
        const grouped = {};
        data.Positions.forEach(pos => {
          if (!grouped[pos.PlayerID]) {
            grouped[pos.PlayerID] = [];
          }
          grouped[pos.PlayerID].push({
            x: pos.x,
            y: pos.y,
            time: pos.Timestamp
          });
        });

        // Convert to series array
        const series = Object.entries(grouped).map(([id, points]) => ({
          label: `Player ${id}`,
          data: points.sort((a, b) => a.time - b.time),
          showMarkLine: true
        }));

        setLocData(series); // Set the location data
      } catch (error) {
        console.error('Error fetching player location data:', error);
      }
    };

    fetchLocData();
  }, []);

  if (locData === null) {
    return <Typography>Loading...</Typography>; // Show loading text while fetching
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ScatterChart
        width={600}
        height={300}
        series={locData}
        xAxis={[{ label: 'X Position', dataKey: 'x' }]}
        yAxis={[{ label: 'Y Position', dataKey: 'y' }]}
        grid={{ vertical: true, horizontal: true }}
      />
    </motion.div>
  );
};

export default PlayerLocation;
