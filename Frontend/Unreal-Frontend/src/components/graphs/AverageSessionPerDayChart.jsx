import React, { useEffect, useState } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import dayjs from 'dayjs';

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

const AverageSessionPerDayChart = ({ filter }) => {
  const [series, setSeries] = useState([]);
  const [labels, setLabels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndProcess = async () => {
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
        setLabels(sortedDates);

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
      xAxis={[{ data: labels, scaleType: 'point', label: 'Date' }]}
      series={series}
      width={800}
      height={400}
    />
  ) : (
    <p>No session data available for selected filters.</p>
  );
};

export default AverageSessionPerDayChart;
