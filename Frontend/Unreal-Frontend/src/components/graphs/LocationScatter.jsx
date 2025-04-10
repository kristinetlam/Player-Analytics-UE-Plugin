import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';

const playerLocation = () => {
  const [locData, setLocData] = useState(null);
  //const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLocData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-location-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch player location data');
        }

        const rawData = await response.json();

        // Group by ID
        const grouped = rawData.reduce((acc, point) => {
          if (!acc[point.id]) acc[point.id] = [];
          acc[point.id].push({
            x: point.x,
            y: point.y,
            timestamp: new Date(point.timestamp),
          });
          return acc;
        }, {});

        // Convert to series array
        const series = Object.entries(grouped).map(([id, points]) => ({
          label: `Player ${id}`,
          data: points.sort((a, b) => a.timestamp - b.timestamp),
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
    <ScatterChart
      width={600}
      height={300}
      series={seriesData}
      xAxis={[{ label: 'X Position' }]}
      yAxis={[{ label: 'Y Position' }]}
      grid={{ vertical: true, horizontal: true }}
      connectNulls
      showConnectingLine
    />
  );
};

export default playerLocation;
