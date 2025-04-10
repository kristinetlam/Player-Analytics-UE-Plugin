import React from 'react';
import { Grid, Card, CardContent, Typography, Box } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TimelineIcon from '@mui/icons-material/Timeline';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

const statData = [
  {
    icon: <AccessTimeIcon sx={{ fontSize: 40, color: '#1976d2' }} />,
    title: 'Average',
    value: '44.2s',
  },
  {
    icon: <TimelineIcon sx={{ fontSize: 40, color: '#2e7d32' }} />,
    title: 'Median',
    value: '38s',
  },
  {
    icon: <SwapHorizIcon sx={{ fontSize: 40, color: '#f9a825' }} />,
    title: 'Range',
    value: '2s – 59s',
  },
];

const PlayerSessionStats = () => {
  return (
    <Box sx={{ px: 3, py: 4 }}>
      {/* <Typography variant="h5" fontWeight={600} mb={2}>
        Player Session Statistics
      </Typography> */}
      <Grid container spacing={3}>
        {statData.map((item, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Card
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
                // borderRadius: 3,
                // boxShadow: 2,
              }}
            >
              <Box sx={{ mr: 2 }}>{item.icon}</Box>
              <Box>
                <Typography variant="subtitle2" color="textSecondary">
                  {item.title}
                </Typography>
                <Typography variant="h6" fontWeight={700}>
                  {item.value}
                </Typography>
              </Box>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PlayerSessionStats;
