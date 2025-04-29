import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const AverageSessionLength = ({ filter }) => {
  const [avgSessionLength, setAvgSessionLength] = useState(null);
  const [lastMonthAvgSessionLength, setLastMonthAvgSessionLength] = useState(null);

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
    const fetchAvgSessionLength = async () => {
      try {
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter || {};
  
        const url = new URL('http://50.30.211.229:5000/get-session-data');
        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };
  
        if (!params.start_time || !params.end_time) {
          params.start_time = dayjs().subtract(14, 'day').startOf('day').format('YYYY-MM-DD');
          params.end_time = dayjs().endOf('day').format('YYYY-MM-DD');
        }
        
        
  
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
  
        if (!response.ok) throw new Error('Failed to fetch current session data');
  
        const result = await response.json();
        const sessionData = result['Sessions'] || [];
        const totalSessionLength = sessionData.reduce((acc, item) => {
          const sessionLength = parseFloat(item.EndTime) - parseFloat(item.StartTime);
          return acc + (sessionLength > 0 ? sessionLength : 0);
        }, 0);
        const avgSessionLengthValue = sessionData.length > 0 ? totalSessionLength / sessionData.length : 0;
        setAvgSessionLength(avgSessionLengthValue);
  
        // last month fetch stays same
        const lastMonthUrl = new URL('http://50.30.211.229:5000/get-session-data');
  
        let lastMonthStart, lastMonthEnd;
        if (startDate && endDate) {
          const daysRange = dayjs(endDate).diff(dayjs(startDate), 'day') + 1;
          lastMonthStart = dayjs(startDate).subtract(daysRange, 'day').format('YYYY-MM-DD');
          lastMonthEnd = dayjs(endDate).subtract(daysRange, 'day').format('YYYY-MM-DD');
        } else {
          lastMonthStart = dayjs().subtract(28, 'day').startOf('day').format('YYYY-MM-DD');
          lastMonthEnd = dayjs().subtract(14, 'day').endOf('day').format('YYYY-MM-DD');
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
  
        if (!lastMonthResponse.ok) throw new Error('Failed to fetch last month session data');
  
        const lastMonthResult = await lastMonthResponse.json();
        const lastMonthSessionData = lastMonthResult['Sessions'] || [];
        const totalLastMonthSessionLength = lastMonthSessionData.reduce((acc, item) => {
          const sessionLength = parseFloat(item.EndTime) - parseFloat(item.StartTime);
          return acc + (sessionLength > 0 ? sessionLength : 0);
        }, 0);
        const lastMonthAvg = lastMonthSessionData.length > 0 ? totalLastMonthSessionLength / lastMonthSessionData.length : 0;
        setLastMonthAvgSessionLength(lastMonthAvg);
  
      } catch (error) {
        console.error('Error fetching session data:', error);
        setAvgSessionLength(null);
        setLastMonthAvgSessionLength(null);
      }
    };
  
    fetchAvgSessionLength();
  }, [filter]);
  

  if (avgSessionLength === null) {
    return <Typography>Loading...</Typography>;
  }

  const { color, symbol, percent } = calculateChange(avgSessionLength, lastMonthAvgSessionLength);

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mt: 4, mb: 2 }}>
        {avgSessionLength.toFixed(2)} seconds
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

export default AverageSessionLength;
