import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

export default function PlayerInteractionsScatterChart({ filter }) {
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
        const url = new URL('http://50.30.211.229:5000/get-interaction-data');
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

        if (!response.ok) throw new Error('Failed to fetch interaction data');

        const result = await response.json();
        const mappedData = mapInteractionData(result.Interactions);
        setData(mappedData);
      } catch (error) {
        console.error('Failed to fetch interaction data:', error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  const mapInteractionData = (interactions) => {
    return interactions
      .filter((interaction) => Array.isArray(interaction.InteractionLocation) && interaction.InteractionLocation.length >= 2)
      .map((interaction) => ({
        x: interaction.InteractionLocation[0], // x position
        y: interaction.InteractionLocation[1], // y position
        label: interaction.InteractionDescription?.split(':')[0]?.trim() || 'No description available',
      }));
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (data.length === 0) {
    return <Typography>No interaction data available.</Typography>;
  }

  return (
    <ScatterChart
      xAxis={[{ label: 'X Position' }]}
      yAxis={[{ label: 'Y Position' }]}
      series={[{ data, color: '#FFA726' }]} // Here, the data passed to the series contains 'label' for each point
      width={600}
      height={500}
      tooltip={({ data }) => (
        <div>{data.label}</div> // This will show the description stored in 'label'
      )}
    />
  );
}

