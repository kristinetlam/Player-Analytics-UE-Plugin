// File: GaugeWithTicks.jsx

import React, { useEffect, useState } from 'react';
import {
  GaugeContainer,
  GaugeValueArc,
  GaugeReferenceArc,
  useGaugeState,
} from '@mui/x-charts/Gauge';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';

// Red pointer component
function GaugePointer({ color, strokeWidth = 3 }) {
  const { valueAngle, outerRadius, cx, cy } = useGaugeState();
  if (valueAngle == null) return null;

  // shorten pointer so it ends at the middle of the arc stroke
  const r = outerRadius - strokeWidth / 2;
  const tx = cx + r * Math.sin(valueAngle);
  const ty = cy - r * Math.cos(valueAngle);

  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <path d={`M ${cx} ${cy} L ${tx} ${ty}`} stroke={color} strokeWidth={strokeWidth} />
    </g>
  );
}

// Tick marks & labels
function GaugeTicks({ ticks = [30, 50, 70] }) {
  const { startAngle, endAngle, minValue, maxValue, outerRadius, cx, cy } = useGaugeState();

  return (
    <g>
      {ticks.map((tv) => {
        const angleDeg =
          startAngle +
          ((tv - minValue) / (maxValue - minValue)) * (endAngle - startAngle);
        const rad = (angleDeg * Math.PI) / 180;
        const r1 = outerRadius + 4;
        const r2 = outerRadius + 14;
        const x1 = cx + r1 * Math.sin(rad);
        const y1 = cy - r1 * Math.cos(rad);
        const x2 = cx + r2 * Math.sin(rad);
        const y2 = cy - r2 * Math.cos(rad);
        const lx = cx + (r2 + 12) * Math.sin(rad);
        const ly = cy - (r2 + 12) * Math.cos(rad);

        return (
          <g key={tv}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#666" strokeWidth={2} />
            <text
              x={lx}
              y={ly}
              fill="#333"
              fontSize={12}
              textAnchor="middle"
              alignmentBaseline="middle"
            >
              {tv}
            </text>
          </g>
        );
      })}
    </g>
  );
}

// Main gauge component, fetches backend data and respects the filter
export default function GaugeWithTicks({ filter }) {
  const [percentReturn, setPercentReturn] = useState(0);

  useEffect(() => {
    if (!filter) return;

    const { playerId, patchVersion, startDate, endDate } = filter;
    const end = endDate ? dayjs(endDate) : dayjs();
    const start = startDate ? dayjs(startDate) : end.subtract(7, 'day');

    async function fetchReturnRate() {
      const url = new URL('http://50.30.211.229:5000/get-session-data');
      // apply filter params
      if (playerId)      url.searchParams.append('player_id', playerId);
      if (patchVersion)  url.searchParams.append('game_version', patchVersion);
      url.searchParams.append('start_time', start.format('YYYY-MM-DD'));
      url.searchParams.append('end_time',   end.format('YYYY-MM-DD'));

      try {
        const res = await fetch(url.toString(), {
          headers: { Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}` },
        });
        if (!res.ok) throw new Error('Fetch failed');
        const { Sessions = [] } = await res.json();

        // count sessions per player
        const counts = Sessions.reduce((acc, s) => {
          acc[s.PlayerID] = (acc[s.PlayerID] || 0) + 1;
          return acc;
        }, {});
        const totalPlayers = Object.keys(counts).length;
        const returningCount = Object.values(counts).filter((c) => c > 1).length;
        setPercentReturn(
          totalPlayers ? Math.round((returningCount / totalPlayers) * 100) : 0
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchReturnRate();
  }, [filter]);

  // threshold‐based fill color
  const fillColor =
    percentReturn > 70  ? '#4caf50' :
    percentReturn >= 40 ? '#ffeb3b' :
                           '#f44336';
  const strokeWidth = 12;

  return (
    <Tooltip title={`${percentReturn}%`} placement="top">
      <GaugeContainer
        width={200}
        height={200}
        startAngle={-110}
        endAngle={110}
        value={percentReturn}
        minValue={0}
        maxValue={100}
      >
        {/* grey full background */}
        <GaugeReferenceArc />
        {/* colored fill up to current percent */}
        <GaugeValueArc style={{ fill: fillColor }} />
        {/* ticks at 30/50/70 */}
        <GaugeTicks ticks={[30, 50, 70]} />
        {/* red pointer */}
        <GaugePointer color="red" strokeWidth={3} />
      </GaugeContainer>
    </Tooltip>
  );
}
