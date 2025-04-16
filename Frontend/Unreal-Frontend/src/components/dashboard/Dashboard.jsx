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
      {/* <ThemeSwitcher /> */}
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

  const cardConfigs = [
    {
      title: "Average FPS",
      component: <AverageFPS filter={filter} />,
      sx: {
        flex: '1 1 300px',
        maxWidth: '360px',
        minWidth: '300px',
        minHeight: '200px',
        maxHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
      },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Average Player Return",
      component: (
        <Box sx={{ mt: '-40px' }}>
          <GaugeChartComp filter={filter} />
        </Box>
      ),
      sx: {
        flex: '1 1 300px',
        maxWidth: '360px',
        minWidth: '300px',
        maxHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
      },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Average Session Length",
      component: <AverageSessionLength filter={filter} />,
      sx: {
        flex: '1 1 300px',
        maxWidth: '360px',
        minWidth: '300px',
        minHeight: '240px',
        maxHeight: '300px',
        display: 'flex',
        flexDirection: 'column',
      },
      moveTitleUp: true,
      marginBottom: false,
      centerContent: true,
      fixed: true,
    },
    {
      title: "Environment Interaction",
      description: "Quantifies player interactions with game elements",
      component: <PlayerInteractionsBarGraph filter={filter} />,
      centerContent: true,
    },
    {
      title: "Player Retention",
      description: "Measures return rates based on how many sessions a player has logged in for",
      component: <PlayerRetentionGraph filter={filter} />,
      centerContent: true,
    },
    {
      title: "Item Usage",
      description: "Displays the distribution of player item usage",
      component: <BasicPie filter={filter} />,
      centerContent: true,
      pieBottom: true,
    },
    {
      title: "Player Session Statistics",
      description: "Summarizes player session data with key metrics",
      component: <PlayerSessionStats filter={filter} />,
      sx: {
        flex: '1 1 600px',
        maxWidth: '600px',
        minWidth: '400px',
        minHeight: '380px',
      },
      centerContent: true,
    },
    {
      title: "FPS Performance Scatterplot",
      description: "Tracks frame rate patterns across multiple players and dates",
      component: <FPSOverTime filter={filter} />,
      centerContent: true,
    },
    {
      title: "Average FPS Timeline",
      description: "Player FPS averages grouped by day over time",
      component: <FPSLineChart filter={filter} />,
      centerContent: true,
    },
    {
      title: "Computer Usage Heatmap",
      description:"Visualizes average RAM/CPU usage across the game map",
      component: <Heatmap filter={filter} />,
      sx:{
        flex: '1 1 600px', 
        maxWidth: '700px', 
        minWidth: '400px', minHeight: '380px'
      },
      centerContent: false,
    },
    // {
    //   title: "Player Location",
    //   description: "Visualizes player movement density across the game map",
    //   component: <Heatmap filter={filter} />,
    //   sx: { width: '65%' },
    //   centerContent: false,
    // },
    {
      title: "Player Session Length",
      description: "Illustrates player session lengths grouped by game version patches",
      component: <AverageSessionPerDayChart filter={filter} />,
      centerContent: true,
    },
    {
      title: "Average Return Time",
      description: "Measures return rates based on last login timestamps",
      component: <AverageReturnTimeGraph filter={filter} />,
      sx: {
        flex: '1 1 300px',
        maxWidth: '360px',
        minWidth: '300px',
        maxHeight: '300px',
      },
      centerContent: true,
    },
  ];
  
  

  return (
    <AppProvider 
        navigation={NAVIGATION} 
        router={router} 
        theme={demoTheme}
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

      <DashboardLayout slots={{ toolbarActions: () => <ToolbarActions setOpenFilter={setOpenFilter} setSearchQuery={setSearchQuery} /> }}>
        <DashboardContent pathname={router.pathname} sx={{ backgroundColor: '#f7f7f7' , minHeight: '100vh' }}>
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 2,
              px: 2,
              pb: 4,
            }}
          >
            {cardConfigs
              .filter(({ title, description }) =>
                title.toLowerCase().includes(searchQuery) ||
                (description && description.toLowerCase().includes(searchQuery))
              )
              .map(({ title, component, description, sx, centerContent, fixed, moveTitleUp }, index) => (
                <CardComponent
                  key={index}
                  title={title}
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