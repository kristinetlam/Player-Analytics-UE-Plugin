import React, { useState } from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import FilterPanel from './PrettyFilterComponent';
import Select from '@mui/material/Select';

export default function BasicFilterSelect() {
  const [showFilter, setShowFilter] = useState(false);

  return (
    <Box sx={{ width: 200, display: { xs: 'none', md: 'inline-block' }, mr: 1 }}>     
    <FormControl fullWidth size="small">
       <InputLabel id="filter-select-label">Filter</InputLabel>
       <Select
         labelId="filter-select-label"
         id="filter-select"
         label="Filter"
         open={false}
         onClick={() => setShowFilter(prev => !prev)}
       />
     </FormControl>

      {showFilter && (
        <Box
          sx={{
            position: 'absolute',
            top: '100%',
            mt: 1,
            width: 300,
            zIndex: 10,
          }}
        >
          <FilterPanel />
        </Box>
      )}
    </Box>
  );
}
