import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import dayjs from 'dayjs';

/**
 * Renders a scatter chart displaying average FPS values over time,
 * grouped by player. Each player's data is shown as a separate color-coded series.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.filter - Filter options for fetching FPS data.
 * @param {string} [props.filter.playerId] - Player ID to filter data.
 * @param {string} [props.filter.patchVersion] - Game version/patch to filter by.
 * @param {string} [props.filter.gpuGroup] - GPU group to filter by.
 * @param {string} [props.filter.startDate] - Start date (ISO format) for data range.
 * @param {string} [props.filter.endDate] - End date (ISO format) for data range.
 * @returns {JSX.Element} A rendered scatter chart or a loading/empty message.
 */
const FpsScatterChart = ({ filter }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [xLabels, setXLabels] = useState([]);
  const [loading, setLoading] = useState(true);
  const COLORS = ['#F4A261', '#E76F51', '#2A9D8F', '#E9C46A'];

  useEffect(() => {
    if (!filter) return;

    /**
     * Fetches average FPS data from the backend and processes it into
     * a format suitable for rendering in a scatter chart.
     */
    const fetchFpsData = async () => {
      try {
        setLoading(true);

        const url = new URL('http://50.30.211.229:5000/get-avg-fps-data');
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

        if (!response.ok) throw new Error('Failed to fetch FPS data');

        const result = await response.json();
        const fpsData = result['AVG FPS'] || [];

        const grouped = {};
        const xSet = new Set();

        fpsData.forEach((item, i) => {
          if (!item.Timestamp || item.AverageFPS === undefined) return;

          const [year, month, day] = item.Timestamp.split('-')[0].split('.').map(Number);
          const date = new Date(year, month - 1, day);
          const dateLabel = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

          const point = {
            id: `${i}`,
            x: dateLabel,
            y: parseFloat(item.AverageFPS),
          };

          if (!grouped[item.PlayerID]) grouped[item.PlayerID] = [];
          grouped[item.PlayerID].push(point);
          xSet.add(dateLabel);
        });

        const formattedSeries = Object.entries(grouped).map(([playerId, points], index) => ({
          label: `Player ${playerId.slice(0, 4)}`,
          data: points,
          color: COLORS[index % COLORS.length],
        }));

        setSeriesData(formattedSeries);
        setXLabels([...xSet]);
      } catch (error) {
        console.error('Error fetching FPS data:', error);
        setSeriesData([]);
        setXLabels([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFpsData();
  }, [filter]);

  const hasData = seriesData.length > 0 && xLabels.length > 0;

  if (loading) return <p>Loading scatter chart...</p>;
  if (!hasData) return <p>No FPS scatter data available for this filter.</p>;

  return (
    <ScatterChart
      width={500}
      height={300}
      series={seriesData}
      xAxis={[{ scaleType: 'point', label: 'Date', data: xLabels }]}
      yAxis={[{ label: 'FPS' }]}
      legend={{ hidden: true }}
    />
  );
};

export default FpsScatterChart;
