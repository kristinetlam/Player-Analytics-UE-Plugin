import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

const PlayerLocation = ({ filter }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return;
    }

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

        // Add fields parameter to get Position data
        url.searchParams.append('fields', 'Position');

        // Add all other parameters
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
          // Map the moment data to get position coordinates
          const mappedData = responseData.Moments
            .filter(moment => moment.Position && Array.isArray(moment.Position) && moment.Position.length >= 2 && moment.Timestamp)
            .map(moment => {
              const timestamp = dayjs(moment.Timestamp, 'YYYY.MM.DD-HH.mm.ss').valueOf();
              return {
                x: moment.Position[0],
                y: moment.Position[1],
                timestamp,
              };
            })
            .sort((a, b) => a.timestamp - b.timestamp);

          // Guard clause in case no data after filtering
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
      yAxis={[{ label: 'Y Position' }]}
      series={[{ data }]}
      width={600}
      height={500}
      margin={{ top: 30, right: 30, bottom: 50, left: 70 }}
    />
  );
};

export default PlayerLocation;
