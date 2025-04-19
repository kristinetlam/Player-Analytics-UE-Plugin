import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const AverageFPS = ({ filter }) => {
  const [avgFps, setAvgFps] = useState(null);

  useEffect(() => {
    if (!filter) return;

    const fetchAvgFps = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-avg-fps-data');
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };


        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString(), {
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
        const fpsData = result['AVG FPS'] || [];

        if (fpsData.length === 0) {
          setAvgFps(0);
          return;
        }

        const totalFps = fpsData.reduce((acc, item) => acc + item.AverageFPS, 0);
        const avgFpsValue = totalFps / fpsData.length;

        setAvgFps(avgFpsValue);
      } catch (error) {
        console.error('Error fetching average FPS:', error);
        setAvgFps(null);
      }
    };

    fetchAvgFps();
  }, [filter]);

  if (avgFps === null) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {avgFps.toFixed(2)}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'normal', color: 'green', mt: 1 }}>
        ↑ 25%
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}>
        per player session
      </Typography>
    </>
  );
};

export default AverageFPS;
