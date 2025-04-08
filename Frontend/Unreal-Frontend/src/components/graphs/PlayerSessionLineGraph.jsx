import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const SessionLineChart = () => {
  const [xData, setXData] = useState([]);
  const [yData, setYData] = useState([]);

  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-session-data', {
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
        const sessionData = result['Sessions'];

        // Sort and prepare data
        const sorted = sessionData.sort(
          (a, b) => new Date(a.Timestamp) - new Date(b.Timestamp)
        );

        const x = sorted.map(item =>
          new Date(item.Timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        );

        const y = sorted.map(item => parseFloat(item.EndTime));

        setXData(x);
        setYData(y);
      } catch (error) {
        console.error('Error fetching session data:', error);
      }
    };

    fetchSessionData();
  }, []);

  return (
    <LineChart
      xAxis={[{ data: xData, scaleType: 'point' }]}
      series={[{ data: yData, label: 'Session Length (s)' }]}
      width={600}
      height={300}
    />
  );
};

export default SessionLineChart;
