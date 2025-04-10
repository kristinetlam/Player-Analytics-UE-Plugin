import React, { useState } from 'react';
import { Box, Stack, IconButton } from '@mui/material';
import TuneIcon from '@mui/icons-material/Tune';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { createTheme } from '@mui/material/styles';
import { useDemoRouter } from '@toolpad/core/internal';
import FilterDrawer from "../FilterComponent";
import CardComponent from '../CardComponent';

// Graphs
import AverageFPS from '../graphs/AverageFPS';
import GaugeChartComp from '../graphs/GaugeChart';
import AverageSessionLength from '../graphs/AverageSessionLength';
import PlayerInteractionsBarGraph from '../graphs/PlayerInteractionGraph';
import PlayerRetentionGraph from '../graphs/PlayerRetentionGraph';
import AverageReturnTimeGraph from '../graphs/AverageReturnTime';
import BasicPie from '../graphs/PieChart';
import PlayerSessionStats from '../graphs/SessionTable';
import FPSOverTime from '../graphs/FPSPlayerScatter';
import FPSLineChart from '../graphs/AverageFPSOverTime';
import ApexChart from '../graphs/Heatmap';
import SessionLineChart from '../graphs/PlayerSessionLineGraph';

const demoTheme = createTheme();

const Dashboard = () => {
  const router = useDemoRouter('/dashboard');
  const [openFilter, setOpenFilter] = useState(false);

  // Shared filter state
  const [filter, setFilter] = useState({
    playerId: '',
    patchVersion: '',
    startDate: null,
    endDate: null,
  });
  

  return (
    <AppProvider navigation={[]} router={router} theme={demoTheme}>
      <DashboardLayout
        slots={{
          toolbarActions: () => (
            <Stack direction="row">
              <IconButton onClick={() => setOpenFilter(true)}>
                <TuneIcon />
              </IconButton>
            </Stack>
          ),
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
            <CardComponent title="Average FPS"><AverageFPS filter={filter} /></CardComponent>
            <CardComponent title="Average Player Return"><GaugeChartComp filter={filter} /></CardComponent>
            <CardComponent title="Average Session Length"><AverageSessionLength filter={filter} /></CardComponent>
            <CardComponent title="Environment Interaction"><PlayerInteractionsBarGraph filter={filter} /></CardComponent>
            <CardComponent title="Player Retention"><PlayerRetentionGraph filter={filter} /></CardComponent>
            <CardComponent title="Average Return Time"><AverageReturnTimeGraph filter={filter} /></CardComponent>
            {/* <CardComponent title="Item Usage"><BasicPie filter={filter} /></CardComponent> */}
            <CardComponent title="Player Session Statistics"><PlayerSessionStats filter={filter} /></CardComponent>
            <CardComponent title="FPS Performance Scatterplot"><FPSOverTime filter={filter} /></CardComponent>
            <CardComponent title="Average FPS Timeline"><FPSLineChart filter={filter} /></CardComponent>
            {/* <CardComponent title="Player Location"><ApexChart filter={filter} /></CardComponent> */}
            <CardComponent title="Player Session Length"><SessionLineChart filter={filter} /></CardComponent>
          </Box>
        </Box>

        <FilterDrawer
          open={openFilter}
          onClose={() => setOpenFilter(false)}
          filter={filter}
          setFilter={setFilter}
        />
      </DashboardLayout>
    </AppProvider>
  );
};

export default Dashboard;
