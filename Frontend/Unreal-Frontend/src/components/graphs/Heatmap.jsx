import React, { useEffect, useState} from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ReactApexChart from 'react-apexcharts';
import {
  Unstable_NumberInput as BaseNumberInput,
  numberInputClasses,
} from '@mui/base/Unstable_NumberInput';
import { styled } from '@mui/system';


const Heatmap = () => {

  const [binSize, setBin] = React.useState(20);
  const [mapType, setMapType] = React.useState('RAM');

  const handleMapType = (event, newMapType) => {
    setMapType(newMapType);
  };

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

  useEffect(() => {
    const fetchPositionData = async () => {
      try {
        
        const response = await fetch('http://' + "50.30.211.229:5000" + '/get-position-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch FPS data');

        const result = await response.json();


        console.log(result);

        const positionData = result['Positions'];

        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;
        let minZ = Infinity, maxZ = -Infinity;

        positionData.forEach((item, i) => {
          // const [year, month, day] = item.Timestamp.split('-')[0].split('.').map(Number);
          // const date = new Date(year, month - 1, day);
          // const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const pos = item.Position;
          if (pos[0] < minX) minX = pos[0];
          if (pos[0] > maxX) maxX = pos[0];

          if (pos[1] < minY) minY = pos[1];
          if (pos[1] > maxY) maxY = pos[1];

          if (pos[2] < minZ) minZ = pos[2];
          if (pos[2] > maxZ) maxZ = pos[2];
        });

        // console.log("Minimum (x,y,z): " + minX + ", " + minY + ", " + minZ);
        // console.log("Maximum (x,y,z): " + maxX + ", " + maxY + ", " + maxZ);

        const createIntervals = (min, max, steps) => {
          const interval = (max - min) / steps;
          return Array.from({ length: steps + 1 }, (_, i) => min + i * interval);
        };

        const xCategories = createIntervals(minX, maxX, binSize);
        const yCategories = createIntervals(minY, maxY, binSize);
        const zCategories = createIntervals(minZ, maxZ, binSize);

        const data = [];
        const categories = [];

        yCategories.forEach(yBin => {
          if(yBin != yCategories[binSize]){

            data.push({
              name: `${yBin.toFixed(2)}`,
              data: Array(binSize).fill(0)
            })
          }
        });

        xCategories.forEach(xBin => {
          if(xBin != xCategories[binSize]){
            categories.push(`${xBin.toFixed(2)}`);
          }
        });



        // Get's the frequency of the player's position.
        positionData.forEach(item => {
          const pos = item.Position;
          for(var i = 1; i < binSize+1; i++){
            if(pos[1] < (yCategories[i]+.0001) && pos[1] >= yCategories[i-1]){

              for(var j = 1; j < binSize+1; j++){
                if(pos[0] < (xCategories[j]+.0001) && pos[0] >= xCategories[j-1]){

                  data[i-1].data[j-1]++;

                }
              }

            }
          }
        });



        
        setState({
          series: data,
          options: {
            chart: {
              height: 450,
              type: 'heatmap', 
            },
            dataLabels: {
              enabled: false
            },
            colors: colors,
            fontFamily: "Avenir",
            fontWeight: 400,
            xaxis: {
              type: 'category',
              categories: categories
            },
            grid: {
              padding: {
                right: 20
              }
            },
            // title: {
            //   text: "Currently: X-Position vs Y-Position"
            // }
          },
      });

      // console.log(data);
      // console.log(categories);

      } catch (error) {
        console.error('Error fetching FPS data:', error);
      }
    };

    fetchPositionData();
    
  }, [binSize, mapType]);

    const colors = ['#008FFB'];

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
        <div style={{ display: 'flex', gap: '16px', justifyContent: "flex-end"}}>
          <div>
            <ToggleButtonGroup
              value={mapType}
              exclusive
              onChange={handleMapType}
              aria-label="Heatmap Type"
            >
              <ToggleButton value="RAM" aria-label="RAM Usage Heatmap">
                <span>RAM</span>
              </ToggleButton>
              <ToggleButton value="CPU" aria-label="CPU Usage Heatmap">
                <span>CPU</span>
              </ToggleButton>
            </ToggleButtonGroup>
          </div>

          <div>
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
    );
}

export default Heatmap;

