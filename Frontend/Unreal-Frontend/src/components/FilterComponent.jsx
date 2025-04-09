import React, { useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
// import DatePicker from 'react-datepicker';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import 'react-datepicker/dist/react-datepicker.css';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CloseIcon from '@mui/icons-material/Close';

export default function FilterDrawer({ open, onClose }) {
  const [playerId, setPlayerId] = useState('');
  const [patchVersion, setPatchVersion] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);

  const handleApply = () => {
    console.log({ playerId, patchVersion, selectedDate });
    onClose();
  };

  const handleReset = () => {
    setPlayerId('');
    setPatchVersion('');
    setSelectedDate(null);
  };

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: 1200,
        position: 'fixed',
        left: 0,
        top: 0,
        width: '100vw',
        height: '100vh',
        '&.MuiBackdrop-root': {
          marginLeft: 0,
        },
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          width: 300,
          backgroundColor: 'white',
          position: 'relative',
          marginLeft: 0
        }}
      >
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <CloseIcon />
          {/* <ArrowForwardIcon /> */}
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Filter
        </Typography>

        <Typography variant="body2">Player ID</Typography>
        <TextField
          fullWidth
          size="small"
          placeholder="Enter player ID"
          value={playerId}
          onChange={(e) => setPlayerId(e.target.value)}
          sx={{
            mb: 2,
            '& input::placeholder': {
              textAlign: 'center',
            },
            '& input': {
              textAlign: 'center',
            },
          }}
        />

        <Typography variant="body2">Patch</Typography>
        <Select
          fullWidth
          size="small"
          displayEmpty
          value={patchVersion}
          onChange={(e) => setPatchVersion(e.target.value)}
          sx={{ mb: 2 }}
        >
          <MenuItem value="" disabled>Select patch</MenuItem>
          <MenuItem value="v1.0">v1.0</MenuItem>
          <MenuItem value="v1.1">v1.1</MenuItem>
        </Select>

        <Typography variant="body2">Timestamp</Typography>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            value={selectedDate}
            onChange={(newValue) => setSelectedDate(newValue)}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                placeholder: 'Enter Time',
                sx: {
                  '& .MuiInputBase-root': {
                    justifyContent: 'center', // centers input + icon as siblings
                  },
                  '& .MuiInputBase-input': {
                    textAlign: 'center',      // centers the text
                  },
                  '& .MuiInputAdornment-root': {
                    position: 'absolute',
                    right: 8,
                  },
                },
              },
            }}
            
          />
        </LocalizationProvider>

        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Button fullWidth variant="contained" onClick={handleApply}>
            Apply
          </Button>
          <Button fullWidth variant="outlined" onClick={handleReset}>
            Reset
          </Button>
        </Stack>
      </Paper>
    </Backdrop>
  );
}
