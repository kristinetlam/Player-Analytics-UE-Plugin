import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import dayjs from "dayjs";

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AverageReturnTimeGraph = ({ filter }) => {
  const [returnGapData, setReturnGapData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!filter) return;

    const fetchSessions = async () => {
      try {
        const url = new URL("http://50.30.211.229:5000/get-session-data");
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
          method: "GET",
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch session data");
        }

        const result = await response.json();
        const sessions = result.Sessions;
        const playerSessions = {};

        // Group sessions by PlayerID using EndTime
        sessions.forEach((session) => {
          const playerId = session.PlayerID;
          const endTime = parseFloat(session.EndTime);
          if (!playerSessions[playerId]) playerSessions[playerId] = [];
          playerSessions[playerId].push(endTime);
        });

        // Sort session times
        Object.values(playerSessions).forEach((list) => list.sort((a, b) => a - b));

        const gaps = {};

        Object.values(playerSessions).forEach((sessionTimes) => {
          for (let i = 1; i < sessionTimes.length; i++) {
            const gap = sessionTimes[i] - sessionTimes[i - 1];
            const key = `${i}`; // gap between i and i+1 sessions
            if (!gaps[key]) gaps[key] = [];
            gaps[key].push(gap);
          }
        });

        const labels = Object.keys(gaps).map((k) => `Session ${k}→${parseInt(k) + 1}`);
        const data = Object.values(gaps).map((gapList) => {
          const sum = gapList.reduce((a, b) => a + b, 0);
          return parseFloat((sum / gapList.length).toFixed(2));
        });

        setReturnGapData({
          labels,
          datasets: [
            {
              label: "Avg Time Between Sessions (seconds)",
              data,
              fill: false,
              borderColor: "rgba(255,99,132,1)",
              tension: 0.3,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error("Error fetching session data:", error);
        setReturnGapData(null);
        setLoading(false);
      }
    };

    fetchSessions();
  }, [filter]);

  if (loading) return <p>Loading return time graph...</p>;
  if (!returnGapData) return <p>No data to display.</p>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-md max-w-3xl mx-auto">
      <Line data={returnGapData} />
    </div>
  );
};

export default AverageReturnTimeGraph;
