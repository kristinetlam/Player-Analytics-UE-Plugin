// Merged and updated Dashboard component with navigation and universal filter

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { createTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import BarChartIcon from '@mui/icons-material/BarChart';
import DescriptionIcon from '@mui/icons-material/Description';
import LayersIcon from '@mui/icons-material/Layers';
import { AppProvider } from '@toolpad/core/AppProvider';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
import TuneIcon from '@mui/icons-material/Tune';
import { useEffect } from 'react';

// Components
import CardComponent from '../CardComponent';
import FilterDrawer from '../FilterComponent';
import DashboardContent from './DashboardContent';

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
import SessionLineChart from '../graphs/PlayerSessionLineGraph';
import AverageSessionPerDayChart from '../graphs/AverageSessionPerDayChart';
import LocationScatterplot from '../graphs/LocationScatter';
import LocationLine from '../graphs/LocationLine';
import Heatmap from '../graphs/Heatmap';

const NAVIGATION = [
  {
    kind: 'header',
    title: 'Main items',
  },
  {
    segment: 'dashboard',
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'library',
    title: 'UE5 Fab Library',
    icon: <ShoppingCartIcon />,
  },
  {
    kind: 'divider',
  },
  {
    kind: 'header',
    title: 'Analytics',
  },
  {
    segment: 'reports',
    title: 'Reports', // make AI generated reports that have written data about the data points and outliers that can be exported??
    icon: <BarChartIcon />,
    children: [
      {
        segment: 'optimization',
        title: 'Optimization Data',
        icon: <DescriptionIcon />,
      },
      {
        segment: 'interest',
        title: 'Player Insights',
        icon: <DescriptionIcon />,
      },
    ],
  },
  {
    segment: 'integrations',
    title: 'Integrations',
    icon: <LayersIcon />,
  },
];

const demoTheme = createTheme({
  cssVariables: {
    colorSchemeSelector: 'data-toolpad-color-scheme',
  },
  colorSchemes: { light: true, dark: false },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 600,
      lg: 1200,
      xl: 1536,
    },
  },
});

function DemoPageContent({ pathname }) {
  return (
    <Box
      sx={{
        py: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      {/* <Typography>Dashboard content for {pathname}</Typography> */}
    </Box>
  );
}

DemoPageContent.propTypes = {
  pathname: PropTypes.string.isRequired,
};

function ToolbarActionsSearch() {
  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{
              display: { xs: 'inline', md: 'none' },
            }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        slotProps={{
          input: {
            endAdornment: (
              <IconButton type="button" aria-label="search" size="small">
                <SearchIcon />
              </IconButton>
            ),
            sx: { pr: 0.5 },
          },
        }}
        sx={{ display: { xs: 'none', md: 'inline-block' }, mr: 1 }}
      />
      {/* <ThemeSwitcher /> */}
    </Stack>
  );
}

function ToolbarActions({ setOpenFilter }) {
  return (
    <Stack direction="row" spacing={2}>
      <IconButton onClick={() => setOpenFilter(true)}>
        <TuneIcon />
      </IconButton>
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton type="button" aria-label="search" sx={{ display: { xs: 'inline', md: 'none' } }}>
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <ToolbarActionsSearch />
    </Stack>
  );
}

function DashboardLayoutBasic() {
  const router = useDemoRouter('/dashboard');
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState({ playerId: '', patchVersion: '', startDate: null, endDate: null });

  useEffect(() => {
    // MUI collapse menu button has this aria-label
    const collapseBtn = document.querySelector('[aria-label="collapse menu"]');
    if (collapseBtn) collapseBtn.click();
  }, []);

  return (
    <AppProvider 
        navigation={NAVIGATION} 
        router={router} 
        theme={demoTheme}
        defaultOpen={false}
        branding={{
          logo: (
            <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}>
              <img
                src="/UE-Icon-2023-Black.svg"
                alt="Unreal Engine 5 Logo"
                width={32}
                height={32}
                style={{ display: 'block', marginLeft: '10px' }}
              />
            </Box>
          ),
          title:<span style={{ color: 'rgba(0, 0, 0, 0.8)', marginLeft: '5px' }}>Player Analytics Plugin</span>
        }}
      >

      <DashboardLayout defaultSidebarCollapsed slots={{ toolbarActions: () => <ToolbarActions setOpenFilter={setOpenFilter} /> }}>
        <DashboardContent pathname={router.pathname} sx={{ backgroundColor: '#f7f7f7' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CardComponent title="Average FPS" infoContent="A calcuation showing the average FPS across all player sessions over the past 30 days. Each player’s FPS is averaged per session, then aggregated into an overall average." sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', minHeight: '200px', maxHeight: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><AverageFPS filter={filter} /></CardComponent>
            <CardComponent title="Average Return Rate" infoContent="Represents the average number of return sessions per player after their first session, indicating how often players come back to play again. Calculated as (total sessions - total unique players) ÷ total players. If a specific player is selected, it shows how many times that player returned. This defaults to the past 30 days unless a date range is selected." sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', maxHeight: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><Box sx={{ mt: '-40px' }}><GaugeChartComp filter={filter}/></Box></CardComponent>
            <CardComponent title="Average Session Length" infoContent="A calcuation showing the average session length across all player sessions over the past 30 days. Each player’s session length is recorded when a session ends." sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', minHeight: '240px', maxHeight: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><AverageSessionLength filter={filter} /></CardComponent>
            <CardComponent title="Environment Interaction" infoContent="A bar graph showing each player interaction logged within the game system and their respective counts." description="Quantifies player interactions with game elements" centerContent><PlayerInteractionsBarGraph filter={filter} /></CardComponent>
            <CardComponent title="Player Retention" infoContent="Shows the percentage of players who returned for additional sessions within the selected time range. Each point represents the share of players who reached that session number (e.g., Session 3 means players who logged in at least three times)."
                description="Measures return rates based on how many sessions a player has logged in for" centerContent><PlayerRetentionGraph filter={filter} /></CardComponent>
            {/* <CardComponent title="Item Usage" infoContent="sadsd" description="Displays the distribution of player item usage" pieBottom centerContent><BasicPie filter={filter} /></CardComponent> */}
            <CardComponent title="Player Session Statistics" infoContent="Displays summary statistics for all player session lengths within the selected time range. Includes the average (mean), median, and full range (shortest to longest session). If a player ID is selected, the stats reflect only that player's session data."
                description="Summarizes player session data with key metrics"  sx={{ flex: '1 1 600px', maxWidth: '600px', minWidth: '400px', minHeight: '330px', maxHeight: '400px' }} centerContent><PlayerSessionStats filter={filter} /></CardComponent>
            <CardComponent title="FPS Performance Scatterplot" infoContent="Displays FPS values recorded per player session across time. Each dot represents a session's average FPS, helping visualize performance variations by date."
                description="Tracks frame rate patterns across multiple players and dates" centerContent><FPSOverTime filter={filter} /></CardComponent>
            <CardComponent title="Average FPS Timeline" infoContent="Displays the average FPS per day aggregated across all player sessions. Useful for spotting trends or fluctuations in frame rate performance."
                description="Player FPS averages grouped by day over time" sx={{ flex: '1 1 600px', maxWidth: '600px', minWidth: '400px', minHeight: '330px', maxHeight: '500px' }} centerContent><FPSLineChart filter={filter} /></CardComponent>
            <CardComponent title="Player Session Length" infoContent="Displays average session lengths over time, segmented by game version. Each line represents a different patch version and shows how long players stayed in-game on each day. This helps identify trends or anomalies related to specific updates."
                description="Illustrates player session lengths grouped by game version patches" centerContent><AverageSessionPerDayChart filter={filter} /></CardComponent>
            <CardComponent title="Average Return Time" infoContent="Shows the average amount of time players take to return between each session, identifying player re-engagement speed or gaps in activity across consecutive logins."
               description="Measures the average time between sessions" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', maxHeight: '300px'}}  centerContent><AverageReturnTimeGraph filter={filter} /></CardComponent>
            <CardComponent title="Computer Usage Heatmap" infoContent="TBD" description="Visualizes average RAM/CPU usage across the game map"  sx={{ flex: '1 1 600px', maxWidth: '700px', minWidth: '400px', minHeight: '380px'}} centerContent={false}><Heatmap filter={filter} /></CardComponent>
            <CardComponent title="Player Location" infoContent="Plots the X and Y coordinates of player positions during gameplay. This can help identify hotspots, player movement patterns, or underutilized areas of the map."
                description="Visualizes player location across the game map" sx={{ minWidth:'700px'}} centerContent={true}><LocationScatterplot filter={filter} /></CardComponent>
            <CardComponent title="Player Traversal" infoContent="Plots the paths players take during gameplay. This can help identify hotspots, player movement patterns, or underutilized areas of the map."
                description="Visualizes player routes across the game map" sx={{ minWidth:'700px'}} centerContent={true}><LocationLine filter={filter} /></CardComponent>
          </Box>
        </DashboardContent>
      </DashboardLayout>
      <FilterDrawer 
          open={openFilter} 
          onClose={() => setOpenFilter(false)} 
          filter={filter} 
          setFilter={setFilter} 
          />
    </AppProvider>
  );

  // DashboardLayoutBasic.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * Remove this when copying and pasting into your project.
//    */
//   window: PropTypes.func,
// };
}

export default DashboardLayoutBasic;