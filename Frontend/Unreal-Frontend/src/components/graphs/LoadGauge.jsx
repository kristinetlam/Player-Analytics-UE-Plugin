import React, { useEffect } from 'react';
import { Gauge, gaugeClasses } from '@mui/x-charts/Gauge';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import dayjs from 'dayjs';

/**
 * LoadGauge displays either average CPU or RAM usage in a gauge format,
 * based on filtered player session data. Users can toggle between CPU and RAM views.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.filter - The filter object for querying moment data.
 * @param {string} props.filter.playerId - The player ID to fetch data for.
 * @param {string} props.filter.patchVersion - The game version.
 * @param {string} props.filter.gpuGroup - The GPU group.
 * @param {string|Date} props.filter.startDate - Start date for data range.
 * @param {string|Date} props.filter.endDate - End date for data range.
 * @returns {JSX.Element} A gauge with toggle buttons for CPU and RAM usage.
 */
const LoadGauge = ({ filter }) => {
  const [mapType, setMapType] = React.useState('CPU'); // 'CPU' or 'RAM'
  const [gaugeValue, setGauge] = React.useState(0.0); // Current average value for gauge
  const [gaugeMax, setGaugeMax] = React.useState(100); // Max value for gauge
  const [gaugeText, setGaugeText] = React.useState("No Data"); // Text shown inside the gauge

  const MAX_RAM = 16000; // Maximum RAM for gauge (in MB)

  /**
   * Handles user toggling between CPU and RAM views.
   *
   * @param {React.MouseEvent} event - The mouse event.
   * @param {string} newMapType - The selected map type ('CPU' or 'RAM').
   */
  const handleMapType = (event, newMapType) => {
    setMapType(newMapType);
  };

  useEffect(() => {
    if (!filter) return;

    /**
     * Fetches moment data for the specified filter, calculates average CPU or RAM usage,
     * and updates the gauge accordingly.
     */
    const fetchUsageData = async () => {
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

        let CPUSum = 0.0;
        let RAMSum = 0.0;
        const momentData = result['Moments'];

        momentData.forEach(item => {
          if (item.CPU.length > 0) {
            CPUSum += Math.min(parseFloat(item.CPU), 100.0);
            RAMSum += parseFloat(item.RAM);
          }
        });

        if (mapType === 'CPU') {
          const avgCPU = CPUSum / momentData.length;
          setGauge(parseFloat(avgCPU.toFixed(2)));
          setGaugeMax(100);
          setGaugeText(`${avgCPU.toFixed(2)}%`);
        } else {
          const avgRAM = RAMSum / momentData.length;
          setGauge(parseFloat(avgRAM.toFixed(0)));
          setGaugeMax(MAX_RAM);
          setGaugeText(`${avgRAM.toFixed(0)} MB`);
        }

        console.log(gaugeValue);

      } catch (error) {
        console.error('Error fetching usage data:', error);
      }
    };

    fetchUsageData();

  }, [filter, mapType]);

  const settings = {
    width: 150,
    height: 150,
  };

  return (
    <div>
      <div style={{ paddingTop: "15px", paddingBottom: "5px" }}>
        <Gauge
          {...settings}
          value={parseFloat(gaugeValue)}
          valueMax={gaugeMax}
          cornerRadius="50%"
          sx={(theme) => ({
            [`& .${gaugeClasses.valueText}`]: {
              fontSize: 22,
            },
            [`& .${gaugeClasses.valueArc}`]: {
              fill: '#008FFB',
            },
            [`& .${gaugeClasses.referenceArc}`]: {
              fill: theme.palette.text.disabled,
            },
          })}
          text={gaugeText}
        />
      </div>
      <div style={{ paddingBottom: "15px" }}>
        <ToggleButtonGroup
          value={mapType}
          exclusive
          onChange={handleMapType}
          aria-label="Heatmap Type"
        >
          <ToggleButton value="CPU" aria-label="CPU Usage Heatmap">
            <span>CPU</span>
          </ToggleButton>
          <ToggleButton value="RAM" aria-label="RAM Usage Heatmap">
            <span>RAM</span>
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    </div>
  );
};

export default LoadGauge;
