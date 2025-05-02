import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

/**
 * PlayerLocation
 *
 * A React component that renders a scatter chart of a player's location
 * based on positional "Moment" data retrieved from the backend.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filter object used to query moment data
 * @param {string} props.filter.playerId - The player ID to filter data for
 * @param {string} props.filter.patchVersion - The game patch version
 * @param {string} props.filter.gpuGroup - GPU group identifier
 * @param {string} [props.filter.startDate] - Optional start date (YYYY-MM-DD)
 * @param {string} [props.filter.endDate] - Optional end date (YYYY-MM-DD)
 *
 * @returns {JSX.Element} A scatter chart showing player movement or a loading/message state
 */

const PlayerLocation = ({ filter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return;
    }

    /**
     * Fetches moment data from the API based on the provided filter.
     * Transforms it into a format suitable for the scatter chart.
     */
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = new URL('http://50.30.211.229:5000/get-moment-data');
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;
        
        // Configure the parameters for the moment endpoint
        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };

        // Include only valid query parameters
        url.searchParams.append('fields', 'Position');
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
        
        if (!response.ok) throw new Error('Failed to fetch Moment data');
        
        const responseData = await response.json();
        
        if (responseData.Moments && responseData.Moments.length > 0) {
          // Extract and map valid position data with timestamps
          const mappedData = responseData.Moments
            .filter(moment => moment.Position && Array.isArray(moment.Position) && moment.Position.length >= 2 && moment.Timestamp)
            .map(moment => {
              const timestamp = dayjs(moment.Timestamp, 'YYYY.MM.DD-HH.mm.ss').format('YYYY-MM-DD HH:mm:ss');
              return {
                x: moment.Position[0],
                y: moment.Position[1],
                label: timestamp,
              };
            })
            .sort((a, b) => a.timestamp - b.timestamp);

          if (mappedData.length === 0) {
            setData([]);
            return;
          }

          setData(mappedData);
        } else {
          console.warn("No moment data received or no position information in moments");
          setData([]);
        }
      } catch (error) {
        console.error('Error fetching moment data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [filter]);
  
  if (loading) {
    return <Typography>Loading...</Typography>;
  }
  
  if (data.length === 0) {
    return <Typography>No player position data available.</Typography>;
  }
  
  return (
    <ScatterChart
      xAxis={[{ label: 'X Position' }]}
      yAxis={[{ label: 'Y Position', labelStyle: { transform: 'translateX(-20px)' }}]}
      series={[{ data, valueFormatter: (point) => `${point.label} (x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)})`}]}
      voronoiMaxRadius= {25}
      width={600}
      height={500}
      margin={{ top: 30, right: 30, bottom: 50, left: 80 }}
    />
  );
};

export default PlayerLocation;