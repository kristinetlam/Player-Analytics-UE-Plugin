import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import FilterPanel from './PrettyFilterComponent';

export default function BasicFilterSelect() {
  const [filter, setFilter] = React.useState('');
  const [showFilter, setShowFilter] = useState(false);

  const handleChange = (event) => {
    setFilter(event.target.value);
    setShowFilter(true);
  };

  return (
    <Box sx={{ width: 200, display: { xs: 'none', md: 'inline-block' }, mr: 1 }}>
      <FormControl fullWidth size="small" >
        <InputLabel id="filter-select-label">Filter</InputLabel>
        <Select
          labelId="filter-select-label"
          id="filter-select"
          value={filter}
          label="Filter"
          onChange={handleChange}
        >
          <MenuItem value={10}>Patch Version</MenuItem>
          <MenuItem value={20}>Player ID</MenuItem>
          <MenuItem value={30}>Timestamp</MenuItem>
        </Select>
      </FormControl>
      {showFilter && <FilterPanel />}
    </Box>
  );
}

