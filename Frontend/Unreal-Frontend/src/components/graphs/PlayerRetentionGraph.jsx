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

Chart.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const PlayerRetentionGraph = ({ filter }) => {
  const [loading, setLoading] = useState(false);
  const [retentionData, setRetentionData] = useState(null);

  useEffect(() => {
    if (!filter) return;

    const fetchData = async () => {
      setLoading(true);
      try {
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

        if (!response.ok) throw new Error('Failed to fetch session data');

        const result = await response.json();
        const sessions = result.Sessions || [];
        const playerSessions = {};

        // Group sessions by player
        sessions.forEach((session) => {
          const playerId = session.PlayerID;
          const startTime = parseFloat(session.StartTime);
          if (!playerSessions[playerId]) playerSessions[playerId] = [];
          playerSessions[playerId].push(startTime);
        });

        // Sort sessions for each player
        Object.values(playerSessions).forEach((list) => list.sort((a, b) => a - b));

        const sessionCountRetention = {};
        Object.values(playerSessions).forEach((sessionList) => {
          sessionList.forEach((_, index) => {
            sessionCountRetention[index + 1] = (sessionCountRetention[index + 1] || 0) + 1;
          });
        });

        const totalPlayers = Object.keys(playerSessions).length;
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
      <Line data={retentionData} />
    </div>
  );
};

export default PlayerRetentionGraph;
