import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function DashboardContent({ pathname, children }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Typography variant="h6">Dashboard content for {pathname}</Typography>
      <Box sx={{ width: '100%' }}>
        {children}
      </Box>
    </Box>
  );
}

DashboardContent.propTypes = {
  pathname: PropTypes.string.isRequired,
  children: PropTypes.node,
};
