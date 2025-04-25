import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';

const PlayerHealthChart = ({ filter }) => {
  const [data, setData] = useState([]);
  const [timestamps, setTimestamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) return;

    const fetchData = async () => {
      setLoading(true);
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

        if (!response.ok) throw new Error('Failed to fetch moment data');

        const result = await response.json();
        const moments = result.Moments || [];

        const sortedMoments = moments.sort((a, b) =>
          a.Timestamp.localeCompare(b.Timestamp)
        );

        const healthData = sortedMoments.map((m) => m.PlayerHealth);
        const labels = sortedMoments.map((m) => m.Timestamp);

        setData(healthData);
        setTimestamps(labels);
      } catch (error) {
        console.error('Error fetching player health data:', error);
        setData([]);
        setTimestamps([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) return <p>Loading health data...</p>;
  if (!data.length) return <p>No health data found.</p>;

  return (
    <LineChart
      width={600}
      height={400}
      xAxis={[{ data: timestamps, scaleType: 'point', label: 'Timestamp' }]}
      yAxis={[{ label: 'Player Health' }]}
      series={[{ data, label: 'Health Over Time', color: '#1976d2', showMark: true }]}
    />
  );
};

export default PlayerHealthChart;
