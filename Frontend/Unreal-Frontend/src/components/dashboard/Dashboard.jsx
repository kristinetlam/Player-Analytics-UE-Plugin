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
import { GlobalStyles } from '@mui/material';

// Components
import CardComponent from '../CardComponent';
import FilterDrawer from '../FilterComponent';
import DashboardContent from './DashboardContent';

// Graphs
import AverageFPS from '../graphs/AverageFPS';
import GaugeChartComp from '../graphs/GaugeChart';
import LoadGauge from '../graphs/LoadGauge';
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
import InteractionScatter from '../graphs/InteractionScatter';

  // {
  //   kind: 'header',
  //   title: 'Analytics',
  // },
  // {
  //   segment: 'reports',
  //   title: 'Reports', // make AI generated reports that have written data about the data points and outliers that can be exported??
  //   icon: <BarChartIcon />,
  //   children: [
  //     {
  //       segment: 'optimization',
  //       title: 'Optimization Data',
  //       icon: <DescriptionIcon />,
  //     },
  //     {
  //       segment: 'interest',
  //       title: 'Player Insights',
  //       icon: <DescriptionIcon />,
  //     },
  //   ],
  // },
  // {
  //   segment: 'integrations',
  //   title: 'Integrations',
  //   icon: <LayersIcon />,
  // },

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

function ToolbarActionsSearch({ searchQuery, setSearchQuery }) {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setSearchQuery(inputValue.toLowerCase());
    }
  };

  return (
    <Stack direction="row">
      <Tooltip title="Search" enterDelay={1000}>
        <div>
          <IconButton
            type="button"
            aria-label="search"
            sx={{ display: { xs: 'inline', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
        </div>
      </Tooltip>
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={handleKeyDown}
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
    </Stack>
  );
}

function ToolbarActions({ setOpenFilter, setSearchQuery }) {
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
      <ToolbarActionsSearch setSearchQuery={setSearchQuery} />
    </Stack>
  );
}

function DashboardLayoutBasic() {
  const router = useDemoRouter('/dashboard');
  const [openFilter, setOpenFilter] = useState(false);
  const [filter, setFilter] = useState({ playerId: '', patchVersion: '', startDate: null, endDate: null });
  const [searchQuery, setSearchQuery] = useState('');

  const NAVIGATION = [
    {
      kind: 'header',
      title: 'Main items',
    },
    {
      segment: 'dashboard',
      title: 'Dashboard',
      icon: <DashboardIcon />,
      onClick: () => setSearchQuery(''),
    },
    {
      kind: 'divider',
    },
    {
      segment: 'library',
      title: 'UE5 Fab Library',
      icon: <ShoppingCartIcon />,
    },
  ];
  useEffect(() => {
    const handleDashboardClick = (e) => {
      if (e.target?.textContent?.trim() === 'Dashboard') {
        router.navigate('/dashboard');  // <-- this forces react-router navigation
        setSearchQuery('');              // <-- clear search manually
      }
    };
    document.addEventListener('click', handleDashboardClick);
    return () => document.removeEventListener('click', handleDashboardClick);
  }, [router]);
  
  

  useEffect(() => {
    const collapseBtn = document.querySelector('[aria-label="collapse menu"]');
    if (collapseBtn) collapseBtn.click();
  }, []);

  const cardConfigs = [
    {
      title: "Average FPS",
      infoContent: "Displays the average FPS across all player sessions. If no date range is selected, data from the past 30 days is used by default. Each player’s FPS is averaged per session and then aggregated into an overall average. The percentage shows the change compared to the previous 30-day period.",
      component: <AverageFPS filter={filter} />,
      sx: { flex: '1 1 300px', maxWidth: '300px', minWidth: '300px', minHeight: '200px', maxHeight: '300px', display: 'flex', flexDirection: 'column' },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Average Load",
      infoContent: "A gauge that displays the average usage in CPU or RAM, to a maximum of 100% and 16 GB respectively.",
      component: <Box sx={{ mt: '-40px' }}><LoadGauge filter={filter} /></Box>,
      sx: { flex: '1 1 300px', maxWidth: '300px', minWidth: '300px', maxHeight: '300px', display: 'flex', flexDirection: 'column' },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Return Rate",
      infoContent: "Represents the average number of return sessions per player after their first session, indicating how often players come back to play again. Calculated as (total sessions - total unique players) ÷ total players. If a specific player is selected, it shows how many times that player returned. This defaults to the past 30 days unless a date range is selected.",
      component: <Box sx={{ mt: '-40px' }}><GaugeChartComp filter={filter} /></Box>,
      sx: { flex: '1 1 300px', maxWidth: '300px', minWidth: '300px', maxHeight: '300px', display: 'flex', flexDirection: 'column' },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Average Session Length",
      infoContent: "A calculation showing the average session length across all player sessions over the past 30 days. Each player’s session length is recorded when a session ends.",
      component: <AverageSessionLength filter={filter} />,
      sx: { flex: '1 1 300px', maxWidth: '300px', minWidth: '300px', minHeight: '240px', maxHeight: '300px', display: 'flex', flexDirection: 'column' },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Environment Interaction",
      description: "Quantifies player interactions with game elements",
      infoContent: "A bar graph showing each player interaction logged within the game system and their respective counts.",
      component: <PlayerInteractionsBarGraph filter={filter} />,
      centerContent: true,
    },
    {
      title: "Player Retention",
      description: "Measures return rates based on how many sessions a player has logged in for",
      infoContent: "Shows the percentage of players who returned for additional sessions within the selected time range. Each point represents the share of players who reached that session number (e.g., Session 3 means players who logged in at least three times).",
      component: <PlayerRetentionGraph filter={filter} />,
      centerContent: true,
    },
    {
      title: "Player Session Statistics",
      description: "Summarizes player session data with key metrics",
      infoContent: "Displays summary statistics for all player session lengths within the selected time range. Includes the average (mean), median, and full range (shortest to longest session). If a player ID is selected, the stats reflect only that player's session data.",
      component: <PlayerSessionStats filter={filter} />,
      sx: { flex: '1 1 600px', maxWidth: '600px', minWidth: '400px', minHeight: '330px', maxHeight: '500px' },
      centerContent: true,
    },
    {
      title: "FPS Performance Scatterplot",
      description: "Tracks frame rate patterns across multiple players and dates",
      infoContent: "Displays FPS values recorded per player session across time. Each dot represents a session's average FPS, helping visualize performance variations by date.",
      component: <FPSOverTime filter={filter} />,
      centerContent: true,
    },
    {
      title: "Average FPS Timeline",
      description: "Player FPS averages grouped by day over time",
      infoContent: "Displays the average FPS per day aggregated across all player sessions. Useful for spotting trends or fluctuations in frame rate performance.",
      component: <FPSLineChart filter={filter} />,
      sx: { flex: '1 1 600px', maxWidth: '600px', minWidth: '400px', minHeight: '330px', maxHeight: '700px' },
      centerContent: true,
    },
    {
      title: "Player Session Length",
      description: "Illustrates player session lengths grouped by game version patches",
      infoContent: "Displays average session lengths over time, segmented by game version. Each line represents a different patch version and shows how long players stayed in-game on each day. This helps identify trends or anomalies related to specific updates.",
      component: <AverageSessionPerDayChart filter={filter} />,
      centerContent: true,
    },
    {
      title: "Average Return Time",
      description: "Measures the average time between sessions",
      infoContent: "Shows the average amount of time players take to return between each session, identifying player re-engagement speed or gaps in activity across consecutive logins.",
      component: <AverageReturnTimeGraph filter={filter} />,
      sx: { flex: '1 1 500px', maxWidth: '700px', minWidth: '300px', maxHeight: '700px', minHeight: '500px' },
      centerContent: true,
    },
    {
      title: "Heatmap",
      description: "Visualizes selected values averaged across the game map.",
      infoContent: "Visualizes player X and Y positions across the game map. Data can be analyzed by Seconds Elapsed, FPS, CPU Usage, or RAM Usage. The bin size selector on the right adjusts the map's grid resolution to control the level of detail. Results can also be filtered by GPU in the global filter.",
      component: <Heatmap filter={filter} />,
      sx: { flex: '1 1 600px', maxWidth: '700px', minWidth: '400px', minHeight: '380px' },
      centerContent: false,
    },
    {
      title: "Player Location",
      description: "Visualizes player location across the game map",
      infoContent: "Plots the X and Y coordinates of player positions during gameplay. This can help identify hotspots, player movement patterns, or underutilized areas of the map.",
      component: <LocationScatterplot filter={filter} />,
      sx: { minWidth: '700px' },
      centerContent: true,
    },
    {
      title: "Player Traversal",
      description: "Visualizes player routes across the game map",
      infoContent: "Plots the paths players take during gameplay. This can help identify hotspots, player movement patterns, or underutilized areas of the map.",
      component: <LocationLine filter={filter} />,
      sx: { minWidth: '700px' },
      centerContent: true,
    },
    {
      title: "Interactions Scatterplot",
      description: "Visualizes interactions across the game map",
      infoContent: "Plots the interactions where they occurred on the game map.",
      component: <InteractionScatter filter={filter} />,
      sx: { minWidth: '700px' },
      centerContent: true,
    },
  ];  

  return (
    <AppProvider 
        navigation={NAVIGATION} 
        router={router} 
        theme={demoTheme}
        defaultOpen={false}
        branding={{
          logo: (
            <Box sx={{ display: 'flex', alignItems: 'center', height: 40 }}
            onClick={() => {
              router.navigate('/dashboard');
              setSearchQuery('');
            }}>
              <img
                src="/UE-Icon-2023-Black.svg"
                alt="Unreal Engine 5 Logo"
                width={32}
                height={32}
                style={{ display: 'block', marginLeft: '5px' }}
              />
            </Box>
          ),
          title:
          <span 
            style={{ color: 'rgba(0, 0, 0, 0.8)', marginLeft: '5px' }} 
              onClick={() => {
              router.navigate('/dashboard');
              setSearchQuery('');
            }}
          >
              Player Analytics Plugin</span>
        }}
      >
      <GlobalStyles
        styles={{
          // '.MuiDrawer-root': {
          //   display: 'none !important',
          // },
          // '.MuiDrawer-docked': {
          //   flex: '0 0 auto !important',
          //   width: '0 !important',
          //   overflowX: 'hidden !important',
          // },
          'html, body, #root': {
            height: '100%',
            margin: 0,
            padding: 0,
            backgroundColor: '#f7f7f7',
          },
          '[aria-label="Expand navigation menu"]': {
            display: 'none !important',
          },
        }}
      />

      <DashboardLayout 
        navigation={NAVIGATION}
        defaultSidebarCollapsed
        slots={{ toolbarActions: () => <ToolbarActions setOpenFilter={setOpenFilter} setSearchQuery={setSearchQuery} /> }}
      >
        <DashboardContent pathname={router.pathname} sx={{ backgroundColor: '#f7f7f7', minHeight: '100vh - 64px', paddingBottom: 4 }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            {cardConfigs
              .filter(({ title, description }) =>
                title.toLowerCase().includes(searchQuery) ||
                (description && description.toLowerCase().includes(searchQuery))
              )
              .map(({ title, infoContent, description, component, sx, centerContent, fixed, moveTitleUp }, index) => (
                <CardComponent
                  key={index}
                  title={title}
                  infoContent={infoContent}
                  description={description}
                  sx={sx}
                  centerContent={centerContent}
                  fixed={fixed}
                  moveTitleUp={moveTitleUp}
                >
                  {component}
                </CardComponent>
              ))}
          </Box>
        </DashboardContent>
      </DashboardLayout>
      <FilterDrawer open={openFilter} onClose={() => setOpenFilter(false)} filter={filter} setFilter={setFilter} />
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