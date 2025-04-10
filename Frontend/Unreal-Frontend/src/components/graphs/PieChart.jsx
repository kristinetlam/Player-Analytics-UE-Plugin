import React from 'react';
import { Box } from '@mui/material';

import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie() {
  return (
    <Box mt={3}>
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
    </Box>
  );
}
