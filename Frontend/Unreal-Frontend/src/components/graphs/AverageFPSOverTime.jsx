import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';

/**
 * FPSLineChart Component
 *
 * Displays a line chart of average FPS per day based on the given filter.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filter object for data retrieval
 * @param {string} props.filter.playerId - Player ID
 * @param {string} props.filter.patchVersion - Game version
 * @param {string} props.filter.gpuGroup - GPU group
 * @param {string} [props.filter.startDate] - Start date (optional)
 * @param {string} [props.filter.endDate] - End date (optional)
 * @returns {JSX.Element} A line chart showing average FPS over time
 */
const FPSLineChart = ({ filter }) => {
  const [xLabels, setXLabels] = useState([]); // Dates for x-axis
  const [avgFpsPerDay, setAvgFpsPerDay] = useState([]); // Daily average FPS
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    if (!filter) return;

    /**
     * Fetches FPS data and aggregates it by day.
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

        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        const fpsData = result['AVG FPS'] || [];

        // Group FPS values by date label
        const grouped = {};

        fpsData.forEach((item) => {
          const [datePart] = item.Timestamp.split('-');
          const [year, month, day] = datePart.split('.');
          const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          if (!grouped[dateLabel]) grouped[dateLabel] = [];
          grouped[dateLabel].push(item.AverageFPS);
        });

        // Sort dates chronologically
        const sortedDates = Object.keys(grouped).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        // Calculate average FPS per day
        const averages = sortedDates.map((date) => {
          const values = grouped[date];
          return values.reduce((acc, v) => acc + v, 0) / values.length;
        });

        setXLabels(sortedDates);
        setAvgFpsPerDay(averages);
      } catch (error) {
        console.error('Error fetching FPS data:', error);
        setXLabels([]);
        setAvgFpsPerDay([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFpsData();
  }, [filter]);

  const hasValidData = xLabels.length > 0 && avgFpsPerDay.length > 0;

  if (loading) return <p>Loading FPS data...</p>;
  if (!hasValidData) return <p>No FPS data available for this filter.</p>;

  return (
    <LineChart
      width={580}
      height={350}
      xAxis={[{ data: xLabels, scaleType: 'point', label: 'Date' }]}
      series={[{ data: avgFpsPerDay, label: 'Avg FPS', area: true, color: '#e57373' }]}
      grid={{ vertical: true, horizontal: true }}
      yAxis={[{ label: 'FPS' }]}
      legend={{ hidden: true }}
    />
  );
};

export default FPSLineChart;
