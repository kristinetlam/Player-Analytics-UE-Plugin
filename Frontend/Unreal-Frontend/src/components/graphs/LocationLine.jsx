import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import { Typography } from '@mui/material';
import dayjs from 'dayjs';
import { useXScale, useYScale } from '@mui/x-charts/hooks';

// A helper function to assign a color per player id. Adjust or expand the color palette as needed.
const getColorForId = (id) => {
  // A simple color palette array.
  const colors = ['#1976d2', '#9c27b0', '#ef6c00', '#2e7d32', '#d81b60', '#00acc1'];
  // Convert the player id into a number and use modulo to pick a color.
  return colors[parseInt(id, 36) % colors.length];
};

// A custom component to render a connecting line for a given series.
// We now pass the series object (which contains its own color and sorted data) as a prop.
function LinkPoints({ series }) {
  const xScale = useXScale();
  const yScale = useYScale();

  if (!series.data) return null;

  // Build an SVG path string connecting each point.
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

const PlayerLocation = ({ filter }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL('http://50.30.211.229:5000/get-position-data');
        const { patchVersion, gpuGroup, startDate, endDate } = filter;

        const params = {
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

        if (!response.ok) throw new Error('Failed to fetch position data');

        // Expecting a JSON response that includes a "Positions" array.
        const { Positions } = await response.json();
        const grouped = {};

        // Group the position objects by player id.
        Positions.forEach((pos) => {
          // Ensure we have valid Position data and a Timestamp.
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

        // Now, convert each group into a series. Sort each series by timestamp.
        const series = Object.entries(grouped).map(([playerId, points]) => ({
          id: playerId,
          label: `Player ${playerId}`,
          color: getColorForId(playerId),
          data: points.sort((a, b) => a.timestamp - b.timestamp),
        }));

        setSeriesData(series);
      } catch (err) {
        console.error(err);
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
      yAxis={[{ label: 'Y Position' }]}
      series={seriesData}
      height={500}
      width={600}
      margin={{ top: 30, right: 30, bottom: 50, left: 70 }}
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

export default PlayerLocation;
