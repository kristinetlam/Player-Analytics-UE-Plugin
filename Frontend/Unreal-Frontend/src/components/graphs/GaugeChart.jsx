import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import { Typography } from '@mui/material';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import dayjs from 'dayjs';

/**
 * A white-themed tooltip with a shadow and arrow.
 */
const WhiteTooltip = styled(({ className, ...props }) => (
  <Tooltip arrow classes={{ popper: className }} {...props} />
))(({ theme }) => ({
  [`& .MuiTooltip-tooltip`]: {
    backgroundColor: '#fff',
    color: '#000',
    boxShadow: theme.shadows[1],
    fontSize: theme.typography.pxToRem(12),
  },
  [`& .MuiTooltip-arrow`]: {
    color: '#fff',
  },
}));

/**
 * A red pointer that appears on the gauge to indicate the current value.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {string} [props.color='red'] - Stroke color of the pointer.
 * @param {number} [props.strokeWidth=3] - Stroke width of the pointer line.
 * @returns {JSX.Element|null} Pointer graphic or null if valueAngle is not available.
 */
function GaugePointer({ color = 'red', strokeWidth = 3 }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle == null) return null;

  const r = outerRadius - strokeWidth / 2;
  const tx = cx + r * Math.sin(valueAngle);
  const ty = cy - r * Math.cos(valueAngle);

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <path
        d={`M ${cx} ${cy} L ${tx} ${ty}`}
        stroke={color}
        strokeWidth={strokeWidth}
      />
    </g>
  );
}

/**
 * Displays a gauge showing the average number of follow-up sessions per player,
 * calculated from backend session data filtered by time range, game version, and player.
 *
 * @component
 * @param {Object} props - Component props.
 * @param {Object} props.filter - Filter options for fetching session data.
 * @param {string} [props.filter.playerId] - Specific player ID to filter.
 * @param {string} [props.filter.patchVersion] - Game version to filter.
 * @param {string} [props.filter.startDate] - Start date for the time range.
 * @param {string} [props.filter.endDate] - End date for the time range.
 * @returns {JSX.Element} A styled gauge showing the computed average.
 */
export default function AverageSessionsGauge({ filter }) {
  const [avgSessions, setAvgSessions] = useState(0);

  useEffect(() => {
    if (!filter) return;
    const { playerId, patchVersion, startDate, endDate } = filter;

    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate ? dayjs(startDate) : end.subtract(30, 'day');

    (async () => {
      const url = new URL('http://50.30.211.229:5000/get-session-data');
      if (playerId) url.searchParams.append('player_id', playerId);
      if (patchVersion) url.searchParams.append('game_version', patchVersion);
      url.searchParams.append('start_time', start.format('YYYY-MM-DD'));
      url.searchParams.append('end_time', end.format('YYYY-MM-DD'));

      try {
        const res = await fetch(url.toString(), {
          headers: {
            Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}`,
          },
        });
        if (!res.ok) throw new Error('Fetch failed');
        const { Sessions = [] } = await res.json();

        const totalSessions = Sessions.length;
        const uniquePlayers = new Set(Sessions.map((s) => s.PlayerID)).size;
        const avg = uniquePlayers
          ? (totalSessions - uniquePlayers) / uniquePlayers
          : 0;
        setAvgSessions(avg);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [filter]);

  // Determine fill color based on thresholds
  const fillColor =
    avgSessions >= 20
      ? '#4caf50' // green
      : avgSessions >= 10
      ? '#ffeb3b' // yellow
      : '#f44336'; // red

  /**
   * A dark-themed tooltip for optional usage.
   */
  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip arrow placement="left" classes={{ popper: className }} {...props} />
  ))(({ theme }) => ({
    [`& .MuiTooltip-tooltip`]: {
      backgroundColor: '#333',
      color: '#fff',
      fontSize: theme.typography.pxToRem(12),
      boxShadow: theme.shadows[2],
    },
    [`& .MuiTooltip-arrow`]: {
      color: '#333',
    },
  }));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <GaugeContainer
        width={200}
        height={200}
        startAngle={-110}
        endAngle={110}
        value={avgSessions}
        valueMax={30}
      >
        {/* Grey background track */}
        <GaugeReferenceArc />
        {/* Colored progress arc */}
        <GaugeValueArc style={{ fill: fillColor }} />
        {/* Pointer */}
        <GaugePointer strokeWidth={3} />
      </GaugeContainer>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: -3 }}>
        {avgSessions.toFixed(2)} follow-ups/player
      </Typography>
    </div>
  );
}
