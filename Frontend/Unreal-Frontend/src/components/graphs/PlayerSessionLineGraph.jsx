import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

function parseTimestamp(timestampStr) {
  if (!timestampStr) {
    return null; // Early return for undefined or null input
  }

  try {
    const [datePart, timePart] = timestampStr.split('-');
    if (!datePart || !timePart) {
      throw new Error("Timestamp format error");
    }
    const formattedDate = datePart.replace(/\./g, '-');
    const formattedTime = timePart.replace(/\./g, ':');
    const date = new Date(`${formattedDate}T${formattedTime}`);
    if (isNaN(date)) {
      throw new Error("Invalid date constructed");
    }
    return date;
  } catch (error) {
    console.error("Error parsing timestamp:", timestampStr, error);
    return null;
  }
}
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
        if (!result.Sessions) {
          console.error("No sessions data in response:", result);
          return; // Exit if no sessions data
        }

        const sessionData = result['Sessions'];
        const validData = sessionData.filter(item => item.TimeStamp && parseTimestamp(item.TimeStamp));

        const sorted = validData.sort(
          (a, b) => parseTimestamp(a.TimeStamp) - parseTimestamp(b.TimeStamp)
        );

        const x = sorted.map(item => {
          const date = parseTimestamp(item.TimeStamp);
          return date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Invalid Date';
        });
        const y = sorted.map(item => item.EndTime ? parseFloat(item.EndTime) : 0);

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
