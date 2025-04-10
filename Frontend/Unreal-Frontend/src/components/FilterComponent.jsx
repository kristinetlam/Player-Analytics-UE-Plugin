import React, { useEffect, useState } from 'react';
import {
  Backdrop,
  Box,
  Button,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import CloseIcon from '@mui/icons-material/Close';
import dayjs from 'dayjs';

export default function FilterDrawer({ open, onClose, filter, setFilter }) {
  const { playerId, patchVersion, startDate, endDate } = filter;

  const [playerIds, setPlayerIds] = useState([]);
  const [gameVersions, setGameVersions] = useState([]);

  // Fetch player IDs and patch versions from backend
  useEffect(() => {
    const fetchPlayerIds = async () => {
      try {
        const res = await fetch('http://50.30.211.229:5000/get-player-ids', {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
          },
        });
        const data = await res.json();
        if (data.PlayerIDs) setPlayerIds(data.PlayerIDs);
      } catch (err) {
        console.error('Failed to fetch player IDs:', err);
      }
    };

    const fetchGameVersions = async () => {
      try {
        const res = await fetch('http://50.30.211.229:5000/get-game-versions', {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
          },
        });
        const data = await res.json();
        if (data.GameVersions) setGameVersions(data.GameVersions);
      } catch (err) {
        console.error('Failed to fetch game versions:', err);
      }
    };

    fetchPlayerIds();
    fetchGameVersions();
  }, []);

  const handleReset = () => {
    setFilter({
      playerId: '',
      patchVersion: '',
      startDate: null,
      endDate: null,
    });
  };

  return (
    <Backdrop open={open} sx={{ zIndex: 1200 }}>
      <Paper
        elevation={3}
        sx={{
          p: 3,
          borderRadius: 3,
          width: 300,
          backgroundColor: 'black',
          position: 'relative',
        }}
      >
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ position: 'absolute', top: 16, right: 16 }}
        >
          <CloseIcon />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>
          Filter
        </Typography>

        {/* Player ID Dropdown */}
        <Typography variant="body2">Player ID</Typography>
        <Select
          fullWidth
          size="small"
          value={playerId}
          onChange={(e) => setFilter({ ...filter, playerId: e.target.value })}
          sx={{ mb: 2 }}
          displayEmpty
        >
          <MenuItem value="">All Players</MenuItem>
          {playerIds.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
            </MenuItem>
          ))}
        </Select>

        {/* Patch Version Dropdown */}
        <Typography variant="body2">Patch Version</Typography>
        <Select
          fullWidth
          size="small"
          value={patchVersion}
          onChange={(e) => setFilter({ ...filter, patchVersion: e.target.value })}
          sx={{ mb: 2 }}
          displayEmpty
        >
          <MenuItem value="">All Versions</MenuItem>
          {gameVersions.map((version) => (
            <MenuItem key={version} value={version}>
              {version}
            </MenuItem>
          ))}
        </Select>

        {/* Date Range Picker */}
        <Typography variant="body2" sx={{ mb: 1 }}>
          Date Range
        </Typography>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Start Date"
            value={startDate}
            onChange={(date) => setFilter({ ...filter, startDate: date })}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
                sx: { mb: 2 },
              },
            }}
          />
          <DatePicker
            label="End Date"
            value={endDate}
            onChange={(date) => setFilter({ ...filter, endDate: date })}
            slotProps={{
              textField: {
                fullWidth: true,
                size: 'small',
              },
            }}
          />
        </LocalizationProvider>

        <Stack direction="row" spacing={1} sx={{ mt: 3 }}>
          <Button fullWidth variant="contained" onClick={onClose}>
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
