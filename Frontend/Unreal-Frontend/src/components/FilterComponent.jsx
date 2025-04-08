import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import FilterPanel from './PrettyFilterComponent';

export default function BasicFilterSelect() {
  const [showFilter, setShowFilter] = useState(false);

  const handleOpen = () => {
    setShowFilter(true);
  };

  const handleClose = () => {
    setShowFilter(false);
  };

  return (
    <Box sx={{ width: 200, display: { xs: 'none', md: 'inline-block' }, mr: 1 }}>     
     <FormControl fullWidth size="small" onClick={() => setShowFilter(prev => !prev)}>
        <InputLabel id="filter-select-label">Filter</InputLabel>
        <Select
          labelId="filter-select-label"
          id="filter-select"
          label="Filter"
        />
      </FormControl>

      {showFilter && (
        <Paper
          sx={{
            position: 'absolute',
            zIndex: 10,
            mt: 1,
            p: 2,
            width: 300,
            bgcolor: 'background.paper',
            boxShadow: 3,
          }}
        >
          <FilterPanel />
        </Paper>
      )}
    </Box>
  );
}
