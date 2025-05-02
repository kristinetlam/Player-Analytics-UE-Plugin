import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useXScale, useYScale } from '@mui/x-charts/hooks';

/**
 * Maps a player ID to a consistent color from a preset palette.
 *
 * @param {string} id - Player ID
 * @returns {string} A hex color string
 */
const getColorForId = (id) => {
  const colors = ['#1976d2', '#9c27b0', '#ef6c00', '#2e7d32', '#d81b60', '#00acc1'];
  return colors[parseInt(id, 36) % colors.length];
};

/**
 * LinkPoints
 *
 * A custom SVG renderer that draws a line between a series of points.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.series - Series object containing `data` and `color`
 * @returns {JSX.Element|null} An SVG path connecting the series points
 */
function LinkPoints({ series }) {
  const xScale = useXScale();
  const yScale = useYScale();

  if (!series.data) return null;

  const path = series.data
    .map(({ x, y }) => `${xScale(x)}, ${yScale(y)}`)
    .join(' L ');

  return (
    <path
      fill="none"
      stroke={series.color}
      strokeWidth={2}
      d={`M ${path}`}
    />
  );
}

/**
 * PlayerTraversal
 *
 * Displays player movement and routes using a scatter chart.
 * Each player’s path is shown with connecting lines.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filter object for data query
 * @param {string} props.filter.playerId - Player ID
 * @param {string} props.filter.patchVersion - Game patch version
 * @param {string} props.filter.gpuGroup - GPU group identifier
 * @param {string} [props.filter.startDate] - Optional start date
 * @param {string} [props.filter.endDate] - Optional end date
 *
 * @returns {JSX.Element} A scatter chart with one series per player, with path lines
 */
const PlayerTraversal = ({ filter }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return;
    }

    /**
     * Fetches moment data from the API and formats it by player ID.
     */
    const fetchData = async () => {
      try {
        setLoading(true);
        const url = new URL('http://50.30.211.229:5000/get-moment-data');
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };

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

        if (!response.ok) throw new Error('Failed to fetch position data');

        const responseData = await response.json();
        const grouped = {};

        // Group moments by player and convert into chart points
        responseData.Moments.forEach((pos) => {
          if (!pos.Position || pos.Position.length < 2 || !pos.Timestamp) return;
          const playerId = pos.PlayerID;
          const timestamp = dayjs(pos.Timestamp, 'YYYY.MM.DD-HH.mm.ss').valueOf();
          if (!grouped[playerId]) grouped[playerId] = [];
          grouped[playerId].push({
            x: pos.Position[0],
            y: pos.Position[1],
            timestamp,
          });
        });

        // Create series for each player with sorted data
        const series = Object.entries(grouped).map(([playerId, points]) => ({
          id: playerId,
          color: getColorForId(playerId),
          data: points.sort((a, b) => a.timestamp - b.timestamp),
        }));

        setSeriesData(series);
      } catch (err) {
        console.error('Error fetching moment data:', err);
        setSeriesData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) return <Typography>Loading...</Typography>;
  if (seriesData.length === 0) return <Typography>No player data available.</Typography>;

  return (
    <ScatterChart
      xAxis={[{ label: 'X Position' }]}
      yAxis={[{ label: 'Y Position', labelStyle: { transform: 'translateX(-20px)' } }]}
      series={seriesData}
      height={500}
      width={600}
      margin={{ top: 30, right: 30, bottom: 50, left: 80 }}
      slotProps={{
        legend: { hidden: true },
      }}
    >
      {/* Render a connecting line for each player series */}
      {seriesData.map((series) => (
        <LinkPoints key={series.id} series={series} />
      ))}
    </ScatterChart>
  );
};

export default PlayerTraversal;
