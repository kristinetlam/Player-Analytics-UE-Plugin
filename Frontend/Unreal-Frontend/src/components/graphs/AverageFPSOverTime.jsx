import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const FPSLineChart = () => {
  const [xLabels, setXLabels] = useState([]);
  const [avgFpsPerDay, setAvgFpsPerDay] = useState([]);

  useEffect(() => {
    const fetchFpsData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-avg-fps-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        const fpsData = result['AVG FPS'];

        const grouped = {};

        fpsData.forEach((item) => {
          const [year, month, day] = item.Timestamp.split('-')[0].split('.');
          const dateLabel = new Date(year, month - 1, day).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          });

          if (!grouped[dateLabel]) grouped[dateLabel] = [];
          grouped[dateLabel].push(item.AverageFPS);
        });

        const sortedDates = Object.keys(grouped).sort(
          (a, b) => new Date(a) - new Date(b)
        );

        const averages = sortedDates.map((date) => {
          const values = grouped[date];
          return values.reduce((acc, v) => acc + v, 0) / values.length;
        });

        setXLabels(sortedDates);
        setAvgFpsPerDay(averages);
      } catch (error) {
        console.error('Error fetching FPS data:', error);
      }
    };

    fetchFpsData();
  }, []);

  return (
    <LineChart
      width={500}
      height={300}
      xAxis={[{ data: xLabels, scaleType: 'point', label: 'Date' }]}
      series={[{ data: avgFpsPerDay, label: 'Avg FPS' }]}
      yAxis={[{ label: 'FPS' }]}
      legend={{ hidden: true }}
    />
  );
};

export default FPSLineChart;
