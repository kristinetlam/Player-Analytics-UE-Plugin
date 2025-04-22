import React, { useEffect, useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import dayjs from 'dayjs';

export default function PlayerInteractionsBarGraph({ filter }) {
  const [data, setData] = useState([]);
  const colorPalette = ['#4285F4','#34A853','#FBBC05','#EA4335','#46BDC6','#7B1FA2'];

  useEffect(() => {
    if (!filter) return;
    (async () => {
      const url = new URL('http://50.30.211.229:5000/get-interaction-data');
      const { playerId, patchVersion, startDate, endDate } = filter;
      const params = {
        player_id: playerId,
        game_version: patchVersion,
        start_time: startDate ? dayjs(startDate).format('YYYY-MM-DD') : null,
        end_time:   endDate   ? dayjs(endDate).format('YYYY-MM-DD')   : null,
      };
      Object.entries(params).forEach(([k, v]) => v && url.searchParams.append(k, v));
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${import.meta.env.VITE_API_SECRET_TOKEN}` }
      });
      const json = await res.json();
      const counts = json.Interactions.reduce((acc, { InteractionDescription }) => {
        const key = InteractionDescription.split(':')[0].trim();
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});
      setData(Object.entries(counts).map(([x, y]) => ({ x, y })));
    })();
  }, [filter]);

  return (
    <ResponsiveContainer width={470} height={300}>
      <BarChart data={data}>
        <XAxis dataKey="x" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) => [value, '']}
          separator=""
          wrapperStyle={{ fontSize: 12, borderRadius: 6 }}
          contentStyle={{ borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
        />
        <Bar dataKey="y" radius={[4, 4, 0, 0]}>
          {data.map((entry, idx) => (
            <Cell key={entry.x} fill={colorPalette[idx % colorPalette.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
