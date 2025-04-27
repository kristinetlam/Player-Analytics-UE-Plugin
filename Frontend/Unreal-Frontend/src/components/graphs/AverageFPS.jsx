import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const AverageFPS = ({ filter }) => {
  const [avgFps, setAvgFps] = useState(null);
  const [lastMonthAvgFps, setLastMonthAvgFps] = useState(null);

  const calculateChange = (current, previous) => {
    if (previous === 0 || previous == null) return { percent: 0, color: 'text.secondary', symbol: '' };
    const change = ((current - previous) / previous) * 100;
    return {
      percent: Math.abs(change).toFixed(1),
      color: change >= 0 ? 'green' : 'red',
      symbol: change >= 0 ? '↑' : '↓'
    };
  };

  useEffect(() => {
    const fetchAvgFps = async () => {
      try {
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter || {};

        const url = new URL('http://50.30.211.229:5000/get-avg-fps-data');
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

        if (!response.ok) throw new Error('Failed to fetch current FPS data');

        const result = await response.json();
        const fpsData = result['AVG FPS'] || [];
        const totalFps = fpsData.reduce((acc, item) => acc + item.AverageFPS, 0);
        const avgFpsValue = fpsData.length > 0 ? totalFps / fpsData.length : 0;
        setAvgFps(avgFpsValue);

        // fetch last month fps
        const lastMonthUrl = new URL('http://50.30.211.229:5000/get-avg-fps-data');

        let lastMonthStart, lastMonthEnd;
        if (startDate && endDate) {
          lastMonthStart = dayjs(startDate).subtract(1, 'month').format('YYYY-MM-DD');
          lastMonthEnd = dayjs(endDate).subtract(1, 'month').format('YYYY-MM-DD');

        } else {
          lastMonthStart = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD');
          lastMonthEnd = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD');
        }

        const lastMonthParams = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: lastMonthStart,
          end_time: lastMonthEnd,
        };

        Object.entries(lastMonthParams).forEach(([key, value]) => {
          if (value) lastMonthUrl.searchParams.append(key, value);
        });

        const lastMonthResponse = await fetch(lastMonthUrl.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!lastMonthResponse.ok) throw new Error('Failed to fetch last month FPS');

        const lastMonthResult = await lastMonthResponse.json();
        const lastMonthFpsData = lastMonthResult['AVG FPS'] || [];
        const totalLastMonthFps = lastMonthFpsData.reduce((acc, item) => acc + item.AverageFPS, 0);
        const lastMonthAvg = lastMonthFpsData.length > 0 ? totalLastMonthFps / lastMonthFpsData.length : 0;
        setLastMonthAvgFps(lastMonthAvg);

      } catch (error) {
        console.error('Error fetching FPS data:', error);
        setAvgFps(null);
        setLastMonthAvgFps(null);
      }
    };

    fetchAvgFps();
  }, [filter]);

  if (avgFps === null) {
    return <Typography>Loading...</Typography>;
  }

  const { color, symbol, percent } = calculateChange(avgFps, lastMonthAvgFps);

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: -1, mb: 2 }}>
        {avgFps.toFixed(2)}
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'normal', color: color, mt: 1 }}>
        {symbol} {percent}%
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}>
        per player session
      </Typography>
    </>
  );
};

export default AverageFPS;
