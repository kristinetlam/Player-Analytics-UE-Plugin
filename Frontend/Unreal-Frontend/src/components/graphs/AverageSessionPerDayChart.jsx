import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';

/**
 * Parses a custom-formatted timestamp string into an ISO date string ("YYYY-MM-DD").
 *
 * @param {string} timestampStr - A timestamp string in the format "YYYY.MM.DD-HH.MM.SS".
 * @returns {string|null} ISO date string ("YYYY-MM-DD") or null if the input is invalid.
 */
function parseTimestampToDate(timestampStr) {
  if (!timestampStr || typeof timestampStr !== 'string') {
    console.warn('[SKIPPED] Empty or non-string timestamp:', timestampStr);
    return null;
  }

  try {
    const [datePart, timePart] = timestampStr.split('-');
    if (!datePart || !timePart) {
      console.warn('[SKIPPED] Invalid timestamp format:', timestampStr);
      return null;
    }

    const formattedDate = datePart.replace(/\./g, '-'); // "YYYY-MM-DD"
    const formattedTime = timePart.replace(/\./g, ':'); // "HH:MM:SS"
    const isoString = `${formattedDate}T${formattedTime}`;
    const date = new Date(isoString);

    if (isNaN(date)) {
      console.warn('[SKIPPED] Invalid Date parsed:', isoString);
      return null;
    }

    return date.toISOString().split('T')[0]; // "YYYY-MM-DD"
  } catch (err) {
    console.error('[ERROR] Timestamp parsing error:', timestampStr, err);
    return null;
  }
}

/**
 * Converts a date string to "MM/DD" format.
 *
 * @param {string} dateStr - A string representing a date (e.g., "2023-10-15").
 * @returns {string} The formatted date string in "MM/DD" format.
 */
function formatDateToMMDD(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

/**
 * Renders a line chart displaying the average session length per day grouped by game version.
 * Fetches session data based on the provided filter and computes averages.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.filter - Filtering options for the data fetch.
 * @param {string} [props.filter.playerId] - Filter by player ID.
 * @param {string} [props.filter.patchVersion] - Filter by game version.
 * @param {string} [props.filter.gpuGroup] - Filter by GPU group.
 * @param {string} [props.filter.startDate] - Start date filter (ISO format).
 * @param {string} [props.filter.endDate] - End date filter (ISO format).
 * @returns {JSX.Element} A line chart or a loading/message element.
 */
const AverageSessionPerDayChart = ({ filter }) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcess = async () => {
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

        Object.entries(params).forEach(([key, val]) => {
          if (val) url.searchParams.append(key, val);
        });

        console.log('[FETCHING] Requesting session data from:', url.toString());

        const response = await fetch(url.toString(), {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) throw new Error('Failed to fetch session data');

        const { Sessions = [] } = await response.json();
        console.log('[DATA] Sessions received:', Sessions);

        const versionMap = {};
        const allDates = new Set();

        Sessions.forEach((session) => {
          const version = session['Game Version'] || 'Unknown';
          const sessionDate = parseTimestampToDate(session?.Timestamp);
          if (!sessionDate) {
            console.warn('[SKIPPED] Invalid timestamp in session:', session);
            return;
          }

          const duration = parseFloat(session.EndTime) || 0;

          if (!versionMap[version]) versionMap[version] = {};
          if (!versionMap[version][sessionDate]) versionMap[version][sessionDate] = [];

          versionMap[version][sessionDate].push(duration);
          allDates.add(sessionDate);
        });

        console.log('[GROUPED DATA] Version map:', versionMap);

        const sortedDates = Array.from(allDates).sort((a, b) => new Date(a) - new Date(b));
        const formattedDates = sortedDates.map(date => formatDateToMMDD(date));
        setLabels(formattedDates);

        const formattedSeries = Object.entries(versionMap).map(([version, dateMap]) => {
          const data = sortedDates.map((date) => {
            const sessions = dateMap[date];
            if (!sessions || sessions.length === 0) return null;
            const avg = sessions.reduce((a, b) => a + b, 0) / sessions.length;
            return parseFloat(avg.toFixed(2));
          });

          return { label: version, data };
        });

        console.log('[GRAPH SERIES] Final series for chart:', formattedSeries);

        setSeries(formattedSeries);
      } catch (err) {
        console.error('Error calculating grouped averages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcess();
  }, [filter]);

  if (loading) return <p>Loading daily session averages...</p>;

  return series.length && labels.length ? (
    <LineChart
      xAxis={[{ 
        data: labels, 
        scaleType: 'point', 
        label: 'Date'
      }]}
      yAxis={[{
        label: 'Average Session Duration (seconds)'
      }]}
      series={series}
      width={650}
      height={400}
    />
  ) : (
    <p>No session data available for selected filters.</p>
  );
};

export default AverageSessionPerDayChart;
