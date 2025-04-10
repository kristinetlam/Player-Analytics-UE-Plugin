import React, { useEffect, useState } from 'react';
import { ScatterChart } from '@mui/x-charts/ScatterChart';
import dayjs from 'dayjs';

const FpsScatterChart = ({ filter }) => {
  const [seriesData, setSeriesData] = useState([]);
  const [xLabels, setXLabels] = useState([]);

  useEffect(() => {
    if (!filter) return;

    const fetchFpsData = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-avg-fps-data');
        const { playerId, patchVersion, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
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

        const formattedSeries = Object.entries(grouped).map(([playerId, points]) => ({
          label: `Player ${playerId.slice(0, 4)}`,
          data: points,
        }));

        setSeriesData(formattedSeries);
        setXLabels([...xSet]);
      } catch (error) {
        console.error('Error fetching FPS data:', error);
      }
    };

    fetchFpsData();
  }, [filter]);

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
