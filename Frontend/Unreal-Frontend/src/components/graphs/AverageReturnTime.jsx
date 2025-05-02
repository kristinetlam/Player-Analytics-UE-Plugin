import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import Box from '@mui/material/Box';
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

// Register required Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

/**
 * AverageReturnTimeGraph Component
 *
 * Displays a line chart showing the average time between game sessions.
 *
 * @component
 * @param {Object} props - Component props
 * @param {Object} props.filter - Filter object used to fetch session data
 * @param {string} props.filter.playerId - Player ID
 * @param {string} props.filter.patchVersion - Game version
 * @param {string} props.filter.gpuGroup - GPU group
 * @param {string} [props.filter.startDate] - Start date (optional)
 * @param {string} [props.filter.endDate] - End date (optional)
 * @returns {JSX.Element} A line chart displaying average return times
 */
const AverageReturnTimeGraph = ({ filter }) => {
  const [returnGapData, setReturnGapData] = useState(null); // Chart.js data object
  const [loading, setLoading] = useState(true); // Loading state
  const [timeUnit, setTimeUnit] = useState("hours"); // Time unit for display

  /**
   * Converts seconds to the selected time unit.
   * @param {number} seconds - Time in seconds
   * @returns {number} Converted time
   */
  const convertTime = (seconds) => {
    switch (timeUnit) {
      case "minutes": return seconds / 60;
      case "hours": return seconds / 3600;
      case "days": return seconds / 86400;
      default: return seconds;
    }
  };

  useEffect(() => {
    if (!filter) return;

    /**
     * Fetches session data, calculates average gaps between sessions,
     * and sets up the Chart.js data structure.
     */
    const fetchSessions = async () => {
      try {
        const url = new URL("http://50.30.211.229:5000/get-session-data");
        const { playerId, patchVersion, gpuGroup, startDate, endDate } = filter;

        const params = {
          player_id: playerId,
          gpu_group: gpuGroup,
          game_version: patchVersion,
          start_time: startDate ? dayjs(startDate).format("YYYY-MM-DD") : null,
          end_time: endDate ? dayjs(endDate).format("YYYY-MM-DD") : null,
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

        if (!response.ok) throw new Error("Failed to fetch session data");

        const result = await response.json();
        const sessions = result.Sessions;
        const playerSessions = {};

        // Organize timestamps by player
        sessions.forEach((session) => {
          const playerId = session.PlayerID;
          const timestamp = dayjs(session.Timestamp, "YYYY.MM.DD-HH.mm.ss").valueOf();
          if (!playerSessions[playerId]) playerSessions[playerId] = [];
          playerSessions[playerId].push(timestamp);
        });

        // Sort each player's sessions chronologically
        Object.values(playerSessions).forEach((list) => list.sort((a, b) => a - b));

        // Calculate gaps between sessions
        const gaps = {};
        Object.values(playerSessions).forEach((sessionTimes) => {
          for (let i = 1; i < sessionTimes.length; i++) {
            const gap = (sessionTimes[i] - sessionTimes[i - 1]) / 1000; // in seconds
            const key = `${i}`;
            if (!gaps[key]) gaps[key] = [];
            gaps[key].push(gap);
          }
        });

        // Prepare data for chart
        const labels = Object.keys(gaps).map((k) => `Session ${k}→${parseInt(k) + 1}`);
        const data = Object.values(gaps).map((gapList) => {
          const sum = gapList.reduce((a, b) => a + b, 0);
          return parseFloat(convertTime(sum / gapList.length).toFixed(2));
        });

        setReturnGapData({
          labels,
          datasets: [
            {
              label: `Avg Time Between Sessions (${timeUnit})`,
              data,
              fill: false,
              borderColor: "rgb(223, 79, 79)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              tension: 0.3,
              pointRadius: 5,
              pointHoverRadius: 8,
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
  }, [filter, timeUnit]);

  if (loading) return <p>Loading return time graph...</p>;
  if (!returnGapData) return <p>No data to display.</p>;

  return (
    <Box sx={{ width: '600px', height: '100%', p: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <label style={{ marginRight: '8px', fontWeight: '600' }}>Time Unit:</label>
        <select
          value={timeUnit}
          onChange={(e) => setTimeUnit(e.target.value)}
          style={{
            border: '1px solid #ccc',
            borderRadius: '4px',
            padding: '4px 8px',
          }}
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </Box>
      <Box sx={{ height: '500px', width: '100%' }}>
        <Line
          data={returnGapData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              title: {
                display: false,
                text: "Average Time Between Sessions",
                font: { size: 20 },
                padding: { top: 10, bottom: 30 },
              },
              legend: {
                display: false,
                labels: { font: { size: 14 } },
              },
              tooltip: {
                bodyFont: { size: 14 },
                titleFont: { size: 16 },
                padding: 10,
              },
            },
            scales: {
              x: { ticks: { font: { size: 13 } } },
              y: {
                ticks: { font: { size: 13 } },
                title: {
                  display: true,
                  text: `Time (${timeUnit})`,
                  font: { size: 16 },
                },
              },
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AverageReturnTimeGraph;
