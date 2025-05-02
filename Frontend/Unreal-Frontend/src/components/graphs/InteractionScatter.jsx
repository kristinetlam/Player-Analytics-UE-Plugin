import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';

/**
 * PlayerInteractionsScatterChart
 *
 * Displays interaction events on a scatter plot based on interaction location.
 * Each point represents an interaction, labeled with its description.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filter criteria for fetching data
 * @param {string} props.filter.playerId - Player ID to filter interactions
 * @param {string} props.filter.patchVersion - Game version
 * @param {string} props.filter.gpuGroup - GPU group identifier
 * @param {string} [props.filter.startDate] - Optional start date
 * @param {string} [props.filter.endDate] - Optional end date
 * @returns {JSX.Element} A scatter chart with interaction points
 */
export default function PlayerInteractionsScatterChart({ filter }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return;
    }

    /**
     * Fetch interaction data from the server using the provided filter.
     */
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

  /**
   * Maps interaction records to chart-friendly format with (x, y) and interaction description.
   *
   * @param {Array<Object>} interactions - Raw interaction data from API
   * @returns {Array<Object>} Array of chart points with x, y, and interaction description
   */
  const mapInteractionData = (interactions) => {
    return interactions
      .filter(
        (interaction) =>
          Array.isArray(interaction.InteractionLocation) &&
          interaction.InteractionLocation.length >= 2
      )
      .map((interaction) => ({
        x: interaction.InteractionLocation[0],
        y: interaction.InteractionLocation[1],
        label: interaction.InteractionDescription,
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
      yAxis={[{ label: 'Y Position', labelStyle: { transform: 'translateX(-20px)' } }]}
      series={[
        {
          data,
          color: '#FFA726',
          valueFormatter: (point) =>
            `${point.label} (x: ${point.x.toFixed(2)}, y: ${point.y.toFixed(2)})`,
        },
      ]}
      voronoiMaxRadius={25}
      width={600}
      height={500}
      margin={{ top: 30, right: 30, bottom: 50, left: 80 }}
    />
  );
}
