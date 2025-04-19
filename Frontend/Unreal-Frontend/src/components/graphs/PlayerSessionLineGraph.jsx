import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';

function parseTimestamp(timestampStr) {
  if (!timestampStr) return null;

  try {
    const [datePart, ...timeParts] = timestampStr.split('-');
    const timePart = timeParts.join('-'); // Reconstruct in case multiple hyphens exist

    const formattedDate = datePart.replace(/\./g, '-'); // e.g. 2025.04.10 → 2025-04-10
    const formattedTime = timePart.replace(/\./g, ':'); // e.g. 14.34.32 → 14:34:32

    const date = new Date(`${formattedDate}T${formattedTime}`);
    return isNaN(date.getTime()) ? null : date;
  } catch (error) {
    console.error("Error parsing timestamp:", timestampStr, error);
    return null;
  }
}

const SessionLineChart = ({ filter }) => {
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) return;

    const fetchSessionData = async () => {
      try {
        setLoading(true);

        const url = new URL('http://50.30.211.229:5000/get-session-data');
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

        if (!response.ok) {
          throw new Error('Failed to fetch session data');
        }

        const result = await response.json();
        const sessionData = result['Sessions'] || [];
        
        const validData = sessionData.filter(item => item.TimeStamp && parseTimestamp(item.TimeStamp));
        const sorted = validData.sort((a, b) => parseTimestamp(a.TimeStamp) - parseTimestamp(b.TimeStamp));

        const x = sorted.map(item => {
          const date = parseTimestamp(item.TimeStamp);
          return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Invalid';
        });

        const y = sorted.map(item => item.EndTime ? parseFloat(item.EndTime) : 0);

        setXData(x);
        setYData(y);
      } catch (error) {
        console.error('Error fetching session data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSessionData();
  }, [filter]);

  if (loading) return <p>Loading session data...</p>;

  return xData.length && yData.length ? (
    <LineChart
      xAxis={[{ data: xData, scaleType: 'point', label: 'Date' }]}
      series={[{ data: yData, label: 'Session Length (s)' }]}
      width={600}
      height={300}
    />
  ) : (
    <p>No session data available for this filter.</p>
  );
};

export default SessionLineChart;
