import React, { useState } from 'react';
import Select from 'react-select';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';


const FilterPanel = () => {
    const [playerId, setPlayerId] = useState(null);
    const [patchVersion, setPatchVersion] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());

    const playersOptions = [
        { value: 'player1', label: 'Player 1' },
        { value: 'player2', label: 'Player 2' },
        // Add more player options here
    ];

    const patchesOptions = [
        { value: 'v1.0', label: 'Patch v1.0' },
        { value: 'v1.1', label: 'Patch v1.1' },
        // Add more patch options here
    ];

    const handleApplyFilters = () => {
        console.log('Applying Filters:', { playerId, patchVersion, selectedDate });
        // Implement what happens when filters are applied (e.g., fetch data)
    };

    const handleResetFilters = () => {
        setPlayerId(null);
        setPatchVersion(null);
        setSelectedDate(new Date());
        // Add more reset actions if necessary
    };

    return (
        <div className="filter-panel">
            <h3>Filter</h3>
            <Select
                placeholder="Select Player ID"
                value={playersOptions.find(option => option.value === playerId)}
                onChange={option => setPlayerId(option.value)}
                options={playersOptions}
            />
            <Select
                placeholder="Select Patch Version"
                value={patchesOptions.find(option => option.value === patchVersion)}
                onChange={option => setPatchVersion(option.value)}
                options={patchesOptions}
            />
            <DatePicker
                selected={selectedDate}
                onChange={date => setSelectedDate(date)}
            />
            <Box>
                <Button variant="contained" onClick={handleApplyFilters} sx={{ mr: 1 }}>
                Apply
                </Button>
                <Button variant="outlined" onClick={handleResetFilters}>
                Reset
                </Button>
            </Box>

        </div>
    );
};

export default FilterPanel;
