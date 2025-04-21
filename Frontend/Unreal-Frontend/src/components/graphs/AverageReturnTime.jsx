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
  const [timeUnit, setTimeUnit] = useState("hours"); // "seconds", "minutes", "hours", "days"

  const convertTime = (seconds) => {
    switch (timeUnit) {
      case "minutes":
        return seconds / 60;
      case "hours":
        return seconds / 3600;
      case "days":
        return seconds / 86400;
      default:
        return seconds;
    }
  };

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

        sessions.forEach((session) => {
          const playerId = session.PlayerID;
          const timestamp = dayjs(session.Timestamp, "YYYY.MM.DD-HH.mm.ss").valueOf();
          if (!playerSessions[playerId]) playerSessions[playerId] = [];
          playerSessions[playerId].push(timestamp);
        });

        Object.values(playerSessions).forEach((list) => list.sort((a, b) => a - b));

        const gaps = {};

        Object.values(playerSessions).forEach((sessionTimes) => {
          for (let i = 1; i < sessionTimes.length; i++) {
            const gap = (sessionTimes[i] - sessionTimes[i - 1]) / 1000; // milliseconds to seconds
            const key = `${i}`;
            if (!gaps[key]) gaps[key] = [];
            gaps[key].push(gap);
          }
        });

        const labels = Object.keys(gaps).map(
          (k) => `Session ${k}→${parseInt(k) + 1}`
        );
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
              borderColor: "rgba(75, 192, 192, 1)",
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
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-5xl mx-auto" style={{ height: "550px" }}>
      <div className="flex justify-end mb-2">
        <label className="mr-2 font-semibold">Time Unit:</label>
        <select
          value={timeUnit}
          onChange={(e) => setTimeUnit(e.target.value)}
          className="border rounded px-2 py-1"
        >
          <option value="seconds">Seconds</option>
          <option value="minutes">Minutes</option>
          <option value="hours">Hours</option>
          <option value="days">Days</option>
        </select>
      </div>
      <Line
        data={returnGapData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: "Average Time Between Sessions",
              font: {
                size: 20,
              },
              padding: {
                top: 10,
                bottom: 30,
              },
            },
            legend: {
              labels: {
                font: {
                  size: 14,
                },
              },
            },
            tooltip: {
              bodyFont: {
                size: 14,
              },
              titleFont: {
                size: 16,
              },
              padding: 10,
            },
          },
          scales: {
            x: {
              ticks: {
                font: {
                  size: 13,
                },
              },
              title: {
                display: true,
                text: "Session Gap",
                font: {
                  size: 16,
                },
              },
            },
            y: {
              ticks: {
                font: {
                  size: 13,
                },
              },
              title: {
                display: true,
                text: `Time (${timeUnit})`,
                font: {
                  size: 16,
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

export default AverageReturnTimeGraph;
