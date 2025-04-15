import React, { useEffect, useState } from 'react';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const AverageSessionLength = ({ filter }) => {
  const [avgSessionLength, setAvgSessionLength] = useState(null);

  useEffect(() => {
    if (!filter) return;

    const fetchSessionData = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-session-data');
        const { playerId, patchVersion, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
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
          throw new Error('Failed to fetch session data');
        }

        const result = await response.json();
        const sessionData = result['Sessions'] || [];

        if (sessionData.length === 0) {
          setAvgSessionLength(0);
          return;
        }

        const totalSessionLength = sessionData.reduce((acc, item) => acc + parseFloat(item.EndTime), 0);
        const avgSessionLengthValue = totalSessionLength / sessionData.length;

        setAvgSessionLength(avgSessionLengthValue);
      } catch (error) {
        console.error('Error fetching session data:', error);
        setAvgSessionLength(null);
      }
    };

    fetchSessionData();
  }, [filter]);

  if (avgSessionLength === null) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <>
      <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
        {avgSessionLength.toFixed(2)} seconds
      </Typography>
      <Typography variant="body1" sx={{ fontWeight: 'normal', color: 'green', mt: 1 }}>
        ↑ 37%
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 'normal', color: 'text.secondary', fontSize: '0.8rem', mt: 1 }}>
        vs previous 30 days
      </Typography> 
    </>
  );
};

export default AverageSessionLength;
