import React from 'react';
import { Grid2, Box, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimelineIcon from '@mui/icons-material/Timeline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const statData = [
  {
    icon: <AccessTimeIcon sx={{ fontSize: 50, color: '#1976d2' }} />,
    title: 'Average',
    value: '44.2s',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 50, color: '#2e7d32' }} />,
    title: 'Median',
    value: '38s',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 50, color: '#f9a825' }} />,
    title: 'Range',
    value: '2s – 59s',
  },
];

const PlayerSessionStats = () => {
  return (
    <Grid2 container spacing={4} justifyContent="center" alignItems="center" mt={4} gap= {10}>
  {statData.map((item, index) => (
    <Grid2 key={index}>
      <Box display="flex" flexDirection="column" alignItems="center" gap={1}>
        {item.icon}
        <Typography variant="body2" color="text.secondary">
          {item.title}
        </Typography>
        <Typography fontWeight={700} fontSize="1.25rem">
          {item.value}
        </Typography>
      </Box>
    </Grid2>
  ))}
</Grid2>

  );
};

export default PlayerSessionStats;
