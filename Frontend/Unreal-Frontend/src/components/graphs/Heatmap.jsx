import React, { useEffect, useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ReactApexChart from 'react-apexcharts';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';
import dayjs from 'dayjs';

/**
 * Heatmap component to display spatial heatmaps of player metrics (Position, FPS, CPU, RAM).
 * 
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filters for the data fetch (playerId, patchVersion, startDate, endDate)
 * @param {string} props.gpuGroup - GPU group filter for data
 * @returns {JSX.Element}
 */
const Heatmap = ({ filter, gpuGroup }) => {

  const [binSize, setBin] = React.useState(20);
  const [mapType, setMapType] = React.useState('CPU');
  /**
 * Event handler to switch between heatmap types (Position, FPS, CPU, RAM).
 *
 * @param {React.MouseEvent<HTMLElement>} event - The click event.
 * @param {string} newMapType - The newly selected map type.
 */
  const handleMapType = (event, newMapType) => {
    setMapType(newMapType);
  };

  /**
 * Custom styled number input component using MUI BaseNumberInput.
 * Used to set the bin size for the heatmap grid.
 *
 * @component
 */
  const NumberInput = React.forwardRef(function CustomNumberInput(props, ref) {
    return (
      <BaseNumberInput
        slots={{
          root: StyledInputRoot,
          input: StyledInputElement,
          incrementButton: StyledButton,
          decrementButton: StyledButton,
        }}
        slotProps={{
          incrementButton: {
            children: '▴',
          },
          decrementButton: {
            children: '▾',
          },
        }}
        {...props}
        ref={ref}
      />
    );
  });

  const blue = {
    100: '#DAECFF',
    200: '#80BFFF',
    400: '#3399FF',
    500: '#007FFF',
    600: '#0072E5',
  };
  
  const grey = {
    50: '#F3F6F9',
    100: '#E5EAF2',
    200: '#DAE2ED',
    300: '#C7D0DD',
    400: '#B0B8C4',
    500: '#9DA8B7',
    600: '#6B7A90',
    700: '#434D5B',
    800: '#303740',
    900: '#1C2025',
  };
  
  /**
 * Styled root container for number input.
 *
 * @type {import('@mui/system').StyledComponent}
 */
  const StyledInputRoot = styled('div')(
    ({ theme }) => `
    font-family: 'IBM Plex Sans', sans-serif;
    font-weight: 400;
    border-radius: 8px;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 1px solid ${theme.palette.mode === 'dark' ? grey[700] : grey[200]};
    box-shadow: 0 2px 2px ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    display: grid;
    grid-template-columns: 1fr 19px;
    grid-template-rows: 1fr 1fr;
    overflow: hidden;
    column-gap: 8px;
    padding: 4px;
  
    &.${numberInputClasses.focused} {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${theme.palette.mode === 'dark' ? blue[600] : blue[200]};
    }
  
    &:hover {
      border-color: ${blue[400]};
    }
  
    /* firefox */
    &:focus-visible {
      outline: 0;
    }
  `,
  );
  
  /**
 * Styled input element for numeric input.
 *
 * @type {import('@mui/system').StyledComponent}
 */
  const StyledInputElement = styled('input')(
    ({ theme }) => `
    font-size: 0.875rem;
    font-family: inherit;
    font-weight: 400;
    line-height: 1.5;
    grid-column: 1/2;
    grid-row: 1/3;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    background: inherit;
    border: none;
    border-radius: inherit;
    padding: 8px 12px;
    outline: 0;
  `,
  );
  
  /**
 * Styled increment and decrement buttons for number input.
 *
 * @type {import('@mui/system').StyledComponent}
 */
  const StyledButton = styled('button')(
    ({ theme }) => `
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    appearance: none;
    padding: 0;
    width: 19px;
    height: 19px;
    font-family: system-ui, sans-serif;
    font-size: 0.875rem;
    line-height: 1;
    box-sizing: border-box;
    background: ${theme.palette.mode === 'dark' ? grey[900] : '#fff'};
    border: 0;
    color: ${theme.palette.mode === 'dark' ? grey[300] : grey[900]};
    transition-property: all;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 120ms;
  
    &:hover {
      background: ${theme.palette.mode === 'dark' ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === 'dark' ? grey[600] : grey[300]};
      cursor: pointer;
    }
  
    &.${numberInputClasses.incrementButton} {
      grid-column: 2/3;
      grid-row: 1/2;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
      border: 1px solid;
      border-bottom: 0;
  
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
  
    &.${numberInputClasses.decrementButton} {
      grid-column: 2/3;
      grid-row: 2/3;
      border-bottom-left-radius: 4px;
      border-bottom-right-radius: 4px;
      border: 1px solid;
  
      &:hover {
        cursor: pointer;
        background: ${blue[400]};
        color: ${grey[50]};
      }
  
    border-color: ${theme.palette.mode === 'dark' ? grey[800] : grey[200]};
    background: ${theme.palette.mode === 'dark' ? grey[900] : grey[50]};
    color: ${theme.palette.mode === 'dark' ? grey[200] : grey[900]};
    }
  
    & .arrow {
      transform: translateY(-1px);
    }
  `,
  );

  /**
 * Side effect to fetch and process position and performance data
 * when the filter, bin size, or map type changes.
 *
 * Data is transformed into heatmap series data for ApexCharts.
 */
  useEffect(() => {
    if (!filter) return;

    const fetchPositionData = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-moment-data');
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };

        Object.entries(params).forEach(([key, value]) => {
          if (value) url.searchParams.append(key, value);
        });

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch Position data');
        const result = await response.json();

        console.log(result);

        const positionData = result['Moments'];

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        positionData.forEach(item => {
          const [x, y] = item.Position;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        });

        const createIntervals = (min, max, steps) => {
          const interval = (max - min) / steps;
          return Array.from({ length: steps + 1 }, (_, i) => min + i * interval);
        };

        const xCategories = createIntervals(minX, maxX, binSize);
        const yCategories = createIntervals(minY, maxY, binSize);

        const posData = yCategories.slice(0, -1).map((yBin, i) => ({
          name: yBin.toFixed(2),
          data: Array(binSize).fill(0)
        }));

        const FPSData = yCategories.slice(0, -1).map((yBin, i) => ({
          name: yBin.toFixed(2),
          data: Array(binSize).fill(0)
        }));

        const CPUData = yCategories.slice(0, -1).map((yBin, i) => ({
          name: yBin.toFixed(2),
          data: Array(binSize).fill(0)
        }));

        const RAMData = yCategories.slice(0, -1).map((yBin, i) => ({
          name: yBin.toFixed(2),
          data: Array(binSize).fill(0)
        }));

        const validDataPoints = yCategories.slice(0, -1).map((yBin, i) => ({
          name: yBin.toFixed(2),
          data: Array(binSize).fill(0)
        }));

        const categories = xCategories.slice(0, -1).map(x => x.toFixed(2));

        positionData.forEach(item => {
          const [x, y] = item.Position;
          for (let i = 1; i < binSize + 1; i++) {
            if (y < yCategories[i] && y >= yCategories[i - 1]) {
              for (let j = 1; j < binSize + 1; j++) {
                if (x < xCategories[j] && x >= xCategories[j - 1]) {

                  FPSData[i - 1].data[j - 1] *= validDataPoints[i - 1].data[j - 1];
                  CPUData[i - 1].data[j - 1] *= validDataPoints[i - 1].data[j - 1];
                  RAMData[i - 1].data[j - 1] *= validDataPoints[i - 1].data[j - 1];
                  
                  posData[i - 1].data[j - 1]++;

                  if(item.FPS.length > 0){
                    validDataPoints[i - 1].data[j - 1]++;
                    FPSData[i - 1].data[j - 1] += parseFloat(item.FPS);
                    CPUData[i - 1].data[j - 1] += Math.min(parseFloat(item.CPU),100.0);
                    RAMData[i - 1].data[j - 1] += parseFloat(item.RAM);
                  }
                  
                  if(validDataPoints[i - 1].data[j - 1] > 0){
                    FPSData[i - 1].data[j - 1] /= validDataPoints[i - 1].data[j - 1];
                    CPUData[i - 1].data[j - 1] /= validDataPoints[i - 1].data[j - 1];
                    RAMData[i - 1].data[j - 1] /= validDataPoints[i - 1].data[j - 1];
                  }
                }
              }
            }
          }
        });

        switch (mapType) {
          case 'Position':
            setState(prev => ({
              ...prev,
              series: posData,
              options: {
                ...prev.options,
                colors: ['#008FFB'],
                xaxis: { ...prev.options.xaxis, categories }
              }
            }));
            break;
          case 'FPS':
            setState(prev => ({
              ...prev,
              series: FPSData,
              options: {
                ...prev.options,
                colors: ['#FB8F00'],
                xaxis: { ...prev.options.xaxis, categories }
              }
            }));
            break;
          case 'CPU':
            setState(prev => ({
              ...prev,
              series: CPUData,
              options: {
                ...prev.options,
                colors: ['#3FCB00'],
                xaxis: { ...prev.options.xaxis, categories }
              }
            }));
            break;
          case 'RAM':
            setState(prev => ({
              ...prev,
              series: RAMData,
              options: {
                ...prev.options,
                colors: ['#FB08BB'],
                xaxis: { ...prev.options.xaxis, categories }
              }
            }));
            break;
        }
      } catch (error) {
        console.error('Error fetching Position data:', error);
      }
    };

    fetchPositionData();
    
  }, [filter, binSize, mapType]);

    const colors = ['#008FFB'];

    /**
    * State for ApexCharts series and options.
    *
    * @type {[Object, Function]}
    * @property {Array} state.series - The data series for the heatmap
    * @property {Object} state.options - ApexCharts configuration options
    */
    const [state, setState] = React.useState({
        series: [],
        options: {
          chart: {
            height: 450,
            type: 'heatmap', 
          },
          dataLabels: {
            enabled: false
          },
          colors: colors,
          xaxis: {
            type: 'category',
            categories: [],
          },
          grid: {
            padding: {
              right: 20
            }
          }
        },
    });

    return (
    <div>
      <div>
        <div style={{ display: 'flex', gap: '16px', justifyContent: "flex-end"}}>
          <div style={{paddingTop: "15px"}}>
            <ToggleButtonGroup
              value={mapType}
              exclusive
              onChange={handleMapType}
              aria-label="Heatmap Type"
            >
              <ToggleButton value="Position" aria-label="RAM Usage Heatmap">
                <span>Position</span>
              </ToggleButton>
              <ToggleButton value="FPS" aria-label="Average FPS Heatmap">
                <span>FPS</span>
              </ToggleButton>
              <ToggleButton value="CPU" aria-label="CPU Usage Heatmap">
                <span>CPU</span>
              </ToggleButton>
              <ToggleButton value="RAM" aria-label="RAM Usage Heatmap">
                <span>RAM</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div style={{paddingTop: "15px", paddingBottom: "15px"}}>
            <NumberInput
              aria-label="Bin Size Input"
              placeholder="Set a bin size..."
              value={binSize}
              onChange={(event, val) => setBin(val)}
              min={10} 
              max={40}
            />
          </div>
        </div>
        <div id="chart">
            <ReactApexChart options={state.options} series={state.series} type="heatmap" height={450} />
        </div>
        <div id="html-dist"></div>
      </div>
    </div>
  );
};

export default Heatmap;