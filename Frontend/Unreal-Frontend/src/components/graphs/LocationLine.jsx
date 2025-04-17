import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

const LocationLine = () => {
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
        console.log('Fetched data:', data);

        if (data.Positions) {
          const grouped = {};

          // Group the positions by PlayerID
          data.Positions.forEach((pos) => {
            const { PlayerID, Position, Timestamp } = pos;
            if (!grouped[PlayerID]) grouped[PlayerID] = [];

            grouped[PlayerID].push({
              x: Position[0], // X-coordinate
              y: Position[1], // Y-coordinate
              timestamp: Timestamp,
            });
          });

          // Create the line segments for each player
          const allSegments = [];
          Object.entries(grouped).forEach(([playerId, points]) => {
            const sortedPoints = points
              .sort((a, b) => new Date(a.timestamp.replaceAll('.', '-')) - new Date(b.timestamp.replaceAll('.', '-')))
              .map(({ x, y }) => ({ x, y }));

            // Ensure unique X values by adjusting any duplicates slightly
            for (let i = 0; i < sortedPoints.length - 1; i++) {
              let x1 = sortedPoints[i].x;
              let y1 = sortedPoints[i].y;
              let x2 = sortedPoints[i + 1].x;
              let y2 = sortedPoints[i + 1].y;

              // If consecutive X values are equal, nudge the second point slightly
              if (x1 === x2) {
                x2 += 0.0001; // Adjust by a small value
              }

              const segment = {
                id: `${playerId}-${i}`, // Unique key per segment
                label: `Player ${playerId.slice(0, 4)}...`,
                data: [
                  { x: x1, y: y1 },
                  { x: x2, y: y2 },
                ],
              };
              allSegments.push(segment);
            }
          });

          setSeriesData(allSegments);
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
      xAxis={[{ label: 'X Axis' }]}
      yAxis={[{ label: 'Y Axis' }]}
      series={seriesData}
      width={600}
      height={500}
      legend={{ hidden: true }}
    />
  );
};

export default LocationLine;
