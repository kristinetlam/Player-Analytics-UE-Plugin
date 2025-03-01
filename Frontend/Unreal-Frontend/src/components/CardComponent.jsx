// components/CardComponent.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { Box } from '@mui/material';

const CardComponent = ({ children }) => {
  return (
    <Card sx={{ margin: 2, boxShadow: 3 }}>
      <CardContent>
        <Box sx={{ margin: -2, padding: 2 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
