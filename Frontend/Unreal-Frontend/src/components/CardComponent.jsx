// components/CardComponent.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const CardComponent = ({ title, description, children }) => {
  return (
    <Card sx={{ margin: 2, boxShadow: 3, borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ textAlign: 'left', mt: 4, ml: 4, fontWeight: 'bold' }}>
            {title}
        </Typography>
        <Typography color="text.secondary" gutterBottom sx={{ textAlign: 'left', mb: 2, ml: 4 }}>
          {description}
        </Typography>
        <Box sx={{ margin: -2, padding: 2 }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
