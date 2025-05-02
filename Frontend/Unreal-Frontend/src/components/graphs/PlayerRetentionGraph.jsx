import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import dayjs from 'dayjs';

// Register required Chart.js components
Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

/**
 * PlayerRetentionGraph fetches session data for players within a given filter range
 * and calculates the percentage of players returning for successive sessions.
 * The results are displayed as a line chart.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {Object} props.filter - Filter criteria for fetching session data.
 * @param {string} props.filter.playerId - Player ID to filter session data.
 * @param {string} props.filter.patchVersion - Game version to filter sessions.
 * @param {string|Date} props.filter.startDate - Start date for the session data range.
 * @param {string|Date} props.filter.endDate - End date for the session data range.
 * @returns {JSX.Element} Line chart displaying session-based retention percentages.
 */
const PlayerRetentionGraph = ({ filter }) => {
  const [loading, setLoading] = useState(false);
  const [retentionData, setRetentionData] = useState(null);

  useEffect(() => {
    if (!filter) return;

    /**
     * Fetches session data from the backend, calculates retention rates,
     * and formats data for rendering in a Chart.js line chart.
     */
    const fetchData = async () => {
      setLoading(true);
      try {
        const url = new URL('http://50.30.211.229:5000/get-session-data');
        const { playerId, patchVersion, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
          end_time: endDate ? dayjs(endDate).format('YYYY-MM-DD') : null,
        };

        // Append query parameters to the URL
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

        if (!response.ok) throw new Error('Failed to fetch session data');

        const result = await response.json();
        const sessions = result.Sessions || [];
        const playerSessions = {};

        // Group session start times by player
        sessions.forEach((session) => {
          const playerId = session.PlayerID;
          const startTime = parseFloat(session.StartTime);
          if (!playerSessions[playerId]) playerSessions[playerId] = [];
          playerSessions[playerId].push(startTime);
        });

        // Sort session start times for each player
        Object.values(playerSessions).forEach((list) => list.sort((a, b) => a - b));

        // Calculate retention by session index
        const sessionCountRetention = {};
        Object.values(playerSessions).forEach((sessionList) => {
          sessionList.forEach((_, index) => {
            sessionCountRetention[index + 1] = (sessionCountRetention[index + 1] || 0) + 1;
          });
        });

        const totalPlayers = Object.keys(playerSessions).length;

        // Format data for the line chart
        const labels = Object.keys(sessionCountRetention).map((key) => `Session ${key}`);
        const data = Object.values(sessionCountRetention).map((count) =>
          Math.round((count / totalPlayers) * 100)
        );

        setRetentionData({
          labels,
          datasets: [
            {
              label: 'Player Retention (%)',
              data,
              fill: false,
              borderColor: 'rgba(75,192,192,1)',
              tension: 0.3,
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching session data:', error);
        setRetentionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [filter]);

  if (loading) return <p>Loading retention data...</p>;
  if (!retentionData) return <p>No retention data available.</p>;

  return (
    <div style={{ width: '100%' }}>
      <Line 
        data={retentionData} 
        legend={{ display: false }}
      />
    </div>
  );
};

export default PlayerRetentionGraph;
