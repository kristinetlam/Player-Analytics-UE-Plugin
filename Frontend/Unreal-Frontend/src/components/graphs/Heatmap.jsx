import React, { useEffect, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import dayjs from 'dayjs';

const ApexChart = ({ filter }) => {
  const colors = ['#008FFB'];
  const [state, setState] = useState({
    series: [],
    options: {
      chart: {
        height: 450,
        type: 'heatmap',
      },
      dataLabels: { enabled: false },
      colors: colors,
      xaxis: { type: 'category', categories: [] },
      grid: { padding: { right: 20 } }
    },
  });

  useEffect(() => {
    if (!filter) return;

    const fetchPositionData = async () => {
      try {
        const url = new URL('http://50.30.211.229:5000/get-position-data');
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

        if (!response.ok) throw new Error('Failed to fetch Position data');
        const result = await response.json();
        const positionData = result['Positions'] || [];

        const binSize = 30;
        let minX = Infinity, maxX = -Infinity;
        let minY = Infinity, maxY = -Infinity;

        positionData.forEach(item => {
          const [x, y] = item.Position;
          minX = Math.min(minX, x);
          maxX = Math.max(maxX, x);
          minY = Math.min(minY, y);
          maxY = Math.max(maxY, y);
        });

        const createIntervals = (min, max, steps) => {
          const interval = (max - min) / steps;
          return Array.from({ length: steps + 1 }, (_, i) => min + i * interval);
        };

        const xCategories = createIntervals(minX, maxX, binSize);
        const yCategories = createIntervals(minY, maxY, binSize);

        const data = yCategories.slice(0, -1).map((yBin, i) => ({
          name: yBin.toFixed(2),
          data: Array(binSize).fill(0)
        }));

        const categories = xCategories.slice(0, -1).map(x => x.toFixed(2));

        positionData.forEach(item => {
          const [x, y] = item.Position;
          for (let i = 1; i < binSize + 1; i++) {
            if (y < yCategories[i] && y >= yCategories[i - 1]) {
              for (let j = 1; j < binSize + 1; j++) {
                if (x < xCategories[j] && x >= xCategories[j - 1]) {
                  data[i - 1].data[j - 1]++;
                }
              }
            }
          }
        });

        setState(prev => ({
          ...prev,
          series: data,
          options: {
            ...prev.options,
            xaxis: { ...prev.options.xaxis, categories }
          }
        }));

      } catch (error) {
        console.error('Error fetching Position data:', error);
      }
    };

    fetchPositionData();
  }, [filter]);

  return (
    <div>
      <div id="chart">
        <ReactApexChart options={state.options} series={state.series} type="heatmap" height={450} />
      </div>
      <div id="html-dist"></div>
    </div>
  );
};

export default ApexChart;
