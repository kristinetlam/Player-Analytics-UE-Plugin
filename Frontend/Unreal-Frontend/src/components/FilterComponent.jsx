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
  const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;

  const [playerIds, setPlayerIds] = useState([]);
  const [gameVersions, setGameVersions] = useState([]);
  const [gpuGroups, setGpuGroups] = useState([]);

  // Fetch player IDs, patch versions, and GPU groups from backend
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
    
    const fetchGpuGroups = async () => {
      try {
        const res = await fetch('http://50.30.211.229:5000/get-gpu-groups', {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
          },
        });
        const data = await res.json();
        if (data.GPUGroups) setGpuGroups(data.GPUGroups);
      } catch (err) {
        console.error('Failed to fetch GPU groups:', err);
      }
    };

    fetchPlayerIds();
    fetchGameVersions();
    fetchGpuGroups();
  }, []);

  const handleReset = () => {
    setFilter({
      playerId: '',
      patchVersion: '',
      gpuGroup: '',
      startDate: null,
      endDate: null,
    });
  };

  // Handle player ID or GPU group change
  const handlePlayerChange = (e) => {
    // Clear GPU group when specific player is selected
    setFilter({ ...filter, playerId: e.target.value, gpuGroup: '' });
  };

  const handleGpuChange = (e) => {
    // Clear player ID when GPU group is selected
    setFilter({ ...filter, gpuGroup: e.target.value, playerId: '' });
  };

  return (
    <Backdrop
      open={open}
      sx={{
        zIndex: (theme) => theme.zIndex.modal,
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
          onChange={handlePlayerChange}
          sx={{ mb: 2 }}
          displayEmpty
          disabled={!!gpuGroup} // Disable if GPU group is selected
        >
          <MenuItem value="">All Players</MenuItem>
          {playerIds.map((id) => (
            <MenuItem key={id} value={id}>
              {id}
            </MenuItem>
          ))}
        </Select>
        
        {/* GPU Group Dropdown */}
        <Typography variant="body2">GPU Group</Typography>
        <Select
          fullWidth
          size="small"
          value={gpuGroup}
          onChange={handleGpuChange}
          sx={{ mb: 2 }}
          displayEmpty
          disabled={!!playerId} // Disable if player ID is selected
        >
          <MenuItem value="">All GPUs</MenuItem>
          {gpuGroups.map((group) => (
            <MenuItem key={group.gpuName} value={group.gpuName}>
              {group.gpuName} ({group.count} players)
            </MenuItem>
          ))}
        </Select>

        {/* Patch Version Dropdown */}
        <Typography variant="body2">Patch Version</Typography>
        <Select
          fullWidth
          size="small"
          displayEmpty
          value={patchVersion}
          onChange={(e) => setFilter({ ...filter, patchVersion: e.target.value })}
          sx={{
            mb: 2,
            '& .MuiSelect-select': {
              textAlign: 'center',
              paddingRight: '18px !important', // remove icon padding
            },
            '& .MuiSelect-icon': {
              position: 'absolute',
              right: 8,
              pointerEvents: 'none',
            },
            color: patchVersion === '' ? 'rgba(0, 0, 0, 0.38)' : 'inherit',
          }}
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
                placeholder: 'Enter Time',
                sx: {
                  '& .MuiInputBase-root': {
                    justifyContent: 'center',
                  },
                  '& .MuiInputBase-input': {
                    textAlign: 'center',     
                  },
                  '& .MuiInputAdornment-root': {
                    position: 'absolute',
                    right: 8,
                  },
                },
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
                placeholder: 'Enter Time',
                sx: {
                  '& .MuiInputBase-root': {
                    justifyContent: 'center',
                  },
                  '& .MuiInputBase-input': {
                    textAlign: 'center',     
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