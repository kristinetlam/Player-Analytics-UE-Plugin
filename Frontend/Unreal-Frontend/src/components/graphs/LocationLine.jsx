import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

const PlayerPathLineChart = () => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-position-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (data.Positions) {
          const grouped = {};

          data.Positions.forEach((pos) => {
            const { PlayerID, Position, Timestamp } = pos;
            if (!grouped[PlayerID]) grouped[PlayerID] = [];

            grouped[PlayerID].push({
              x: Position[0],
              y: Position[1],
              timestamp: Timestamp,
            });
          });

          // Choose one player (for now) or loop through all later
          const playerId = Object.keys(grouped)[0]; // Just first player
          const sortedPoints = grouped[playerId].sort(
            (a, b) => new Date(a.timestamp.replaceAll('.', '-')) - new Date(b.timestamp.replaceAll('.', '-'))
          );

          const segments = [];
          for (let i = 0; i < sortedPoints.length - 1; i++) {
            segments.push({
              data: [
                { x: sortedPoints[i].x, y: sortedPoints[i].y },
                { x: sortedPoints[i + 1].x, y: sortedPoints[i + 1].y },
              ],
              showMark: false,
              color: '#007bff', // Optional per-player color
              label: `Segment ${i}`,
            });
          }

          setSeriesData(segments);
        } else {
          console.warn('No position data received');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (seriesData.length === 0) {
    return <Typography>No player data available.</Typography>;
  }

  return (
    <LineChart
      xAxis={[{ label: 'X Axis', type: 'linear' }]}
      yAxis={[{ label: 'Y Axis', type: 'linear' }]}
      series={seriesData}
      width={600}
      height={500}
      legend={{ hidden: true }}
    />
  );
};

export default PlayerPathLineChart;