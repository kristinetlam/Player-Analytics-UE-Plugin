import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';

const PlayerLocation = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-position-data');
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };

        const data = await response.json();
        console.log('Fetched data:', data);

        console.log("Example position object:", data.Positions[0]);
        
        if (data.Positions) {
          const mappedData = data.Positions.map(pos => ({
            x: pos.Position[0],
            y: pos.Position[1],
          }));
          setData(mappedData);
        } else {
          console.warn("No position data received");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (data === null) {
    return <Typography>Loading...</Typography>; // Show loading text while fetching
  }
  if (data.length === 0) {
    return <Typography>No player data available.</Typography>;
  }

  return (
    <ScatterChart
      xAxis={[{ label: 'X Axis' }]}
      yAxis={[{ label: 'Y Axis' }]}
      series={[{ data }]}
      width={600}
      height={500}
    />
  );
}

export default PlayerLocation;