import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie() {
  return (
    <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'Series A' },
            { id: 1, value: 15, label: 'Series B' },
            { id: 2, value: 20, label: 'Series C' },
          ],
        },
      ]}
      width={400}
      height={170}
    />
  );
}
