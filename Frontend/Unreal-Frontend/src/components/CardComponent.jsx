// components/CardComponent.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const CardComponent = ({ title, description, children, moveTitleUp, sx }) => {
  return (
    <Card sx={{ margin: 2, boxShadow: 2, borderRadius: 3, ...sx }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ textAlign: 'left',  mt: moveTitleUp ? 2 : 4, ml: 4, fontWeight: 'bold' }}>
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
