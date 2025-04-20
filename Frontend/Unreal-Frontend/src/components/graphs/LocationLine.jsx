import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

const LocationLine = () => {
  const [seriesData, setSeriesData] = useState([]);
  const [xValues, setXValues] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-position-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        if (!response.ok || !data.Positions) {
          throw new Error(data.error || 'Failed to fetch position data.');
        }

        const grouped = {};

        data.Positions.forEach((pos) => {
          const { PlayerID, Position, Timestamp } = pos;
          if (!grouped[PlayerID]) grouped[PlayerID] = [];
          grouped[PlayerID].push({
            x: Position[0],
            y: Position[1],
            timestamp: Timestamp,
          });
        });

        const firstPlayerID = Object.keys(grouped)[0];
        if (!firstPlayerID) {
          setError('No player data available.');
          return;
        }

        const points = grouped[firstPlayerID]
          .sort((a, b) => new Date(a.timestamp.replaceAll('.', '-')) - new Date(b.timestamp.replaceAll('.', '-')));

        // Collect all unique x values
        const uniqueXSet = new Set();
        points.forEach((p) => uniqueXSet.add(p.x));
        const xList = Array.from(uniqueXSet).sort((a, b) => a - b);
        setXValues(xList);

        // Build sparse series
        // Build overlapping segments (each point is reused in 2 segments)
        const sparseSeries = [];
        for (let i = 0; i < points.length - 1; i++) {
          let { x: x1, y: y1 } = points[i];
          let { x: x2, y: y2 } = points[i + 1];

          if (x1 === x2) x2 += 0.0001;

          const data = xList.map((x) => {
            if (x === x1) return y1;
            if (x === x2) return y2;
            return null;
          });

          sparseSeries.push({
            id: `${firstPlayerID}-${i}`,
            label: `Segment ${i}`,
            data,
            color: '#1976d2',
          });
        }

        setSeriesData(sparseSeries);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load player path data.');
      }
    };

    fetchData();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (seriesData.length === 0) return <Typography>Loading or no data available.</Typography>;

  return (
    <LineChart
      xAxis={[{ data: xValues, scaleType: 'linear', label: 'X Position' }]}
      yAxis={[{ label: 'Y Position' }]}
      series={seriesData}
      width={600}
      height={500}
      legend={{ hidden: true }}
    />
  );
};

export default LocationLine;










/*import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { Typography } from '@mui/material';

const LocationLine = () => {
  const [seriesData, setSeriesData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://50.30.211.229:5000/get-position-data', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();
        console.log('Fetched data:', data);

        if (data.Positions) {
          const grouped = {};

          // Group the positions by PlayerID
          data.Positions.forEach((pos) => {
            const { PlayerID, Position, Timestamp } = pos;
            if (!grouped[PlayerID]) grouped[PlayerID] = [];

            grouped[PlayerID].push({
              x: Position[0], // X-coordinate
              y: Position[1], // Y-coordinate
              timestamp: Timestamp,
            });
          });

          // Create the line segments for each player
          const allSegments = [];
          Object.entries(grouped).forEach(([playerId, points]) => {
            const sortedPoints = points
              .sort((a, b) => new Date(a.timestamp.replaceAll('.', '-')) - new Date(b.timestamp.replaceAll('.', '-')))
              .map(({ x, y }) => ({ x, y }));

            // Ensure unique X values by adjusting any duplicates slightly
            for (let i = 0; i < sortedPoints.length - 1; i++) {
              let x1 = sortedPoints[i].x;
              let y1 = sortedPoints[i].y;
              let x2 = sortedPoints[i + 1].x;
              let y2 = sortedPoints[i + 1].y;

              // If consecutive X values are equal, nudge the second point slightly
              if (x1 === x2) {
                x2 += 0.0001; // Adjust by a small value
              }

              const segment = {
                id: `${playerId}-${i}`, // Unique key per segment
                label: `Player ${playerId.slice(0, 4)}...`,
                data: [
                  { x: x1, y: y1 },
                  { x: x2, y: y2 },
                ],
              };
              allSegments.push(segment);
            }
          });

          setSeriesData(allSegments);
        } else {
          console.warn('No position data received');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  if (seriesData.length === 0) {
    return <Typography>No player data available.</Typography>;
  }

  return (
    <LineChart
      xAxis={[{ label: 'X Axis' }]}
      yAxis={[{ label: 'Y Axis' }]}
      series={seriesData}
      width={600}
      height={500}
      legend={{ hidden: true }}
    />
  );
};

export default LocationLine;
*/