// components/CardComponent.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

const CardComponent = ({ title, description, children, moveTitleUp, marginBottom, centerContent, pieBottom, fixed, sx }) => {
  return (
    <Card sx={{ 
      margin: 2, 
      boxShadow: 2, 
      borderRadius: 3, 
      // flex: fixed ? 'none' : '1 0 auto',
      // width: fixed ? '30%' : 'auto',
      ...sx }}>
      <CardContent>
        <Typography variant="h6" component="div" sx={{ textAlign: 'left',  mt: moveTitleUp ? 2 : 4, ml: 4, fontWeight: 'bold' }}>
            {title}
        </Typography>
        <Typography color="text.secondary" gutterBottom sx={{ textAlign: 'left', mb: marginBottom ? 2 : 0, ml: 4, pieBottom: marginBottom ? 10 : 0 }}>
          {description}
        </Typography>
        <Box sx={{ 
            ...(centerContent 
              ? { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' } 
              : {})
          }}>
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export default CardComponent;
