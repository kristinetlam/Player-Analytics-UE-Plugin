import React, { useEffect, useState } from 'react';
import { Grid, Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimelineIcon from '@mui/icons-material/Timeline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import dayjs from 'dayjs';

const PlayerSessionStats = ({ filter }) => {
  const [stats, setStats] = useState({
    average: null,
    median: null,
    range: null,
  });

  useEffect(() => {
    const fetchStats = async () => {
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

        const result = await response.json();
        const sessionData = result['Sessions'] || [];
        const lengths = sessionData.map(s => parseFloat(s.EndTime)).filter(n => !isNaN(n)).sort((a, b) => a - b);

        if (lengths.length === 0) {
          setStats({ average: '0s', median: '0s', range: '0s – 0s' });
          return;
        }

        const avg = lengths.reduce((a, b) => a + b, 0) / lengths.length;
        const mid = Math.floor(lengths.length / 2);
        const median = lengths.length % 2 === 0 ? (lengths[mid - 1] + lengths[mid]) / 2 : lengths[mid];
        const range = `${lengths[0]}s – ${lengths[lengths.length - 1]}s`;

        setStats({
          average: `${avg.toFixed(1)}s`,
          median: `${median.toFixed(0)}s`,
          range,
        });
      } catch (error) {
        console.error('Error fetching session stats:', error);
      }
    };

    fetchStats();
  }, [filter]);

  const statData = [
    {
      icon: <AccessTimeIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
      title: 'Average',
      value: stats.average || '--',
    },
    {
      icon: <TimelineIcon sx={{ fontSize: 50, color: '#2e7d32' }} />,
      title: 'Median',
      value: stats.median || '--',
    },
    {
      icon: <SwapHorizIcon sx={{ fontSize: 50, color: '#f9a825' }} />,
      title: 'Range',
      value: stats.range || '--',
    },
  ];

  return (
    <Box>
      <Grid container spacing={4} justifyContent="center" alignItems="center" mt={4}>
        {statData.map((item, index) => (
          <Grid item key={index}>
            <Box display="flex" flexDirection="column" alignItems="center" gap={0.5} sx={{ minWidth: 100 }}>
              {item.icon}
              <Typography variant="body2" color="text.secondary">{item.title}</Typography>
              <Typography fontWeight={700} fontSize="1.25rem">{item.value}</Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {/**<Box mt={3} display="flex" justifyContent="center" width="100%">
        <Typography variant="body2" color="text.secondary" textAlign="center">
          vs previous 30 days
        </Typography>
      </Box> **/}
    </Box>
  );
};

export default PlayerSessionStats;
