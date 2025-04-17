import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';

const PlayerLocation = () => {
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

          data.Positions.forEach(({ PlayerID, Position }) => {
            if (!grouped[PlayerID]) grouped[PlayerID] = [];

            grouped[PlayerID].push({
              x: Position[0],
              y: Position[1],
            });
          });

          const mappedSeries = Object.entries(grouped).map(([playerId, points]) => ({
            id: playerId, // required by MUI to distinguish series
            label: `Player ${playerId.slice(0, 4)}...`,
            data: points,
          }));

          setSeriesData(mappedSeries);
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
    <ScatterChart
      xAxis={[{ label: 'X Axis' }]}
      yAxis={[{ label: 'Y Axis' }]}
      series={seriesData}
      width={600}
      height={500}
      legend={{ hidden: true }}
    />
  );
};

export default PlayerLocation;

