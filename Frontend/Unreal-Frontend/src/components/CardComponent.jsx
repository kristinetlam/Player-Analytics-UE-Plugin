// components/CardComponent.jsx
import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';
import InfoOutlineIcon from '@mui/icons-material/InfoOutlined';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

const CardComponent = ({ title, description, children, moveTitleUp, marginBottom, centerContent, pieBottom, fixed, infoContent, sx }) => {
  return (
    <Card sx={{ 
      margin: 2, 
      boxShadow: 2, 
      borderRadius: 3, 
      // flex: fixed ? 'none' : '1 0 auto',
      // width: fixed ? '30%' : 'auto',
      ...sx }}>
      <CardContent sx={{ position: 'relative' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: moveTitleUp ? 2 : 4,
          ml: 4,
          mr: 2,
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
        {infoContent && (
          <Tooltip 
              title={
                <Typography sx={{ fontSize: '0.8rem', fontWeight: 500,  }}>
                  {infoContent}
                </Typography>
              }
              placement="top"
              arrow
            >
            <IconButton
              size="small"
              sx={{
                padding: 0,
                backgroundColor: 'transparent',
                boxShadow: 'none',
                '&:hover': { backgroundColor: 'transparent' },
              }}
            >
        <InfoOutlineIcon fontSize="small" sx={{ color: '#555' }} />
      </IconButton>
    </Tooltip>
  )}
</Box>

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
