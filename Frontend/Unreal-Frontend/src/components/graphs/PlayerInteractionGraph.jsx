import * as React from 'react';
import { useEffect, useState } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import dayjs from 'dayjs';

export default function PlayerInteractionsBarGraph({ filter }) {
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!filter) return;

    const fetchData = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-interaction-data');
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

        if (!response.ok) throw new Error('Failed to fetch interaction data');

        const result = await response.json();
        const interactionCounts = countInteractions(result.Interactions);
        setData(interactionCounts);
      } catch (error) {
        console.error('Failed to fetch interaction data:', error);
      }
    };

    fetchData();
  }, [filter]);

  const countInteractions = (interactions) => {
    const normalizeDescription = (desc) => desc?.split(':')[0]?.trim() || '';

    const map = interactions.reduce((acc, item) => {
      const key = normalizeDescription(item.InteractionDescription);
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map).map(([x, y]) => ({ x, y }));
  };

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map(d => d.x), label: 'Interaction Type' }]}
      series={[{ data: data.map(d => d.y)}]}
      width={500}
      height={300}
    />
  );
}
