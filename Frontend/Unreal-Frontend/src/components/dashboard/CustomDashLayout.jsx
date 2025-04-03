import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
// import YourCustomIcon from '@mui/icons-material/YourIcon'; // Replace with your icon
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';

function CustomAppBar() {
    const theme = useTheme();
    const [mode, setMode] = useState(theme.palette.mode);
  
    const toggleMode = () => {
      setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
    };
  
    return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Unreal Engine 5 Player Analytics
          </Typography>
          <IconButton onClick={toggleMode} color="inherit">
            {mode === 'light' ? <Brightness4Icon /> : <Brightness7Icon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    );
  }
export default CustomAppBar;
  
  