import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

/**
 * AverageFPS Component
 *
 * Displays the average FPS for the selected player/date filter,
 * along with a percent change compared to the previous time period.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filter for querying FPS data
 * @param {string} props.filter.playerId - Player ID
 * @param {string} props.filter.patchVersion - Game patch version
 * @param {string} props.filter.gpuGroup - GPU group
 * @param {string} [props.filter.startDate] - Start date (optional)
 * @param {string} [props.filter.endDate] - End date (optional)
 * @returns {JSX.Element} Rendered component
 */
const AverageFPS = ({ filter }) => {
  const [avgFps, setAvgFps] = useState(null);
  const [lastMonthAvgFps, setLastMonthAvgFps] = useState(null);

  /**
   * Calculates percentage change from previous to current FPS average.
   *
   * @param {number} current - Current average FPS
   * @param {number|null} previous - Previous average FPS
   * @returns {{ percent: string, color: string, symbol: string }} Change summary
   */
  const calculateChange = (current, previous) => {
    if (previous === 0 || previous == null) {
      return { percent: '0', color: 'text.secondary', symbol: '' };
    }
    const change = ((current - previous) / previous) * 100;
    return {
      percent: Math.abs(change).toFixed(1),
      color: change >= 0 ? 'green' : 'red',
      symbol: change >= 0 ? '↑' : '↓',
    };
  };

  useEffect(() => {
    /**
     * Fetches current and last-period average FPS data from backend.
     */
    const fetchAvgFps = async () => {
      try {
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter || {};

        const url = new URL('http://50.30.211.229:5000/get-avg-fps-data');
        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate
            ? dayjs(startDate).format('YYYY-MM-DD')
            : dayjs().subtract(30, 'day').startOf('day').format('YYYY-MM-DD'),
          end_time: endDate
            ? dayjs(endDate).format('YYYY-MM-DD')
            : dayjs().endOf('day').format('YYYY-MM-DD'),
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
        const validFpsData = fpsData.filter(item => item.AverageFPS != null);
        const totalFps = validFpsData.reduce((acc, item) => acc + item.AverageFPS, 0);
        const avgFpsValue = validFpsData.length > 0 ? totalFps / validFpsData.length : 0;

        setAvgFps(avgFpsValue);

        // ---- Last month period logic ----
        const lastMonthUrl = new URL('http://50.30.211.229:5000/get-avg-fps-data');

        let lastMonthStart, lastMonthEnd;
        if (startDate && endDate) {
          const daysRange = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
          lastMonthStart = dayjs(startDate).subtract(daysRange, 'day').format('YYYY-MM-DD');
          lastMonthEnd = dayjs(endDate).subtract(daysRange, 'day').format('YYYY-MM-DD');
        } else {
          lastMonthStart = dayjs().subtract(60, 'day').startOf('day').format('YYYY-MM-DD');
          lastMonthEnd = dayjs().subtract(30, 'day').endOf('day').format('YYYY-MM-DD');
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
        const validLastMonthFpsData = lastMonthFpsData.filter(item => item.AverageFPS != null);
        const totalLastMonthFps = validLastMonthFpsData.reduce((acc, item) => acc + item.AverageFPS, 0);
        const lastMonthAvg = validLastMonthFpsData.length > 0
          ? totalLastMonthFps / validLastMonthFpsData.length
          : 0;

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
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
        {avgFps.toFixed(2)} FPS
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'normal', color: color, mt: 1 }}>
        {symbol} {percent}%
      </Typography>
      <Typography
        variant="body2"
        sx={{ fontWeight: 'normal', color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}
      >
        per player session
      </Typography>
    </>
  );
};

export default AverageFPS;
