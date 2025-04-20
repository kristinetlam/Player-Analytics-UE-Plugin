// File: AverageSessionsGauge.jsx

import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Tooltip from '@mui/material/Tooltip';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import dayjs from 'dayjs';

// A white tooltip with arrow
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

// Red pointer component
function GaugePointer({ color = 'red', strokeWidth = 3 }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle == null) return null;

  // shorten pointer so it ends at the middle of the arc stroke
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

export default function AverageSessionsGauge({ filter }) {
  const [avgSessions, setAvgSessions] = useState(0);

  useEffect(() => {
    if (!filter) return;
    const { playerId, patchVersion, startDate, endDate } = filter;
    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate ? dayjs(startDate) : end.subtract(30, 'day');

    (async () => {
      const url = new URL('http://50.30.211.229:5000/get-session-data');
      if (playerId)     url.searchParams.append('player_id', playerId);
      if (patchVersion) url.searchParams.append('game_version', patchVersion);
      url.searchParams.append('start_time', start.format('YYYY-MM-DD'));
      url.searchParams.append('end_time',   end.format('YYYY-MM-DD'));

      try {
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}` },
        });
        if (!res.ok) throw new Error('Fetch failed');
        const { Sessions = [] } = await res.json();

        const totalSessions  = Sessions.length;
        const uniquePlayers  = new Set(Sessions.map(s => s.PlayerID)).size;
        const avg = uniquePlayers ? (totalSessions - uniquePlayers) / uniquePlayers : 0;
        setAvgSessions(avg);
      } catch (err) {
        console.error(err);
      }
    })();
  }, [filter]);

  // Color bands: green ≥2, yellow ≥1, red <1
  const fillColor =
    avgSessions >= 2 ? '#4caf50' :
    avgSessions >= 1 ? '#ffeb3b' :
                       '#f44336';

  // Gauge max: at least 3, or one above the ceiling
  const maxValue = Math.max(3, Math.ceil(avgSessions) + 1);
  const strokeWidth = 12;

  return (
<WhiteTooltip title={`${avgSessions.toFixed(2)} follow-ups/player`}>
<GaugeContainer
        width={200}
        height={200}
        startAngle={-110}
        endAngle={110}
        value={avgSessions}
        minValue={0}
        maxValue={maxValue}
      >
        {/* grey background track */}
        <GaugeReferenceArc />
        {/* colored fill up to avgSessions */}
        <GaugeValueArc style={{ fill: fillColor }} />
        {/* red pointer */}
        <GaugePointer strokeWidth={3} />
      </GaugeContainer>
    </WhiteTooltip>
  );
}
