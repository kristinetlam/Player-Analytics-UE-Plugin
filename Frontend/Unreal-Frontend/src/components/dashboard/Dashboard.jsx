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
import PlayerInteractionsBarGraph from '../graphs/PlayerInteractionGraph';
import BasicLineChart from '../graphs/LineGraph';
import BasicPie from '../graphs/PieChart';
import BasicScatter from '../graphs/ScatterPlot';
import CardComponent from '../CardComponent';
import DashboardContent from './DashboardContent';
import { Card } from '@mui/material';
import ApexChart from '../graphs/Heatmap';
import GaugeChartComp from '../graphs/GaugeChart';
import AverageFPS from '../graphs/AverageFPS';
import AverageSessionLength from '../graphs/AverageSessionLength';
import BasicFilterSelect from '../FilterComponent';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TextField from '@mui/material/TextField';
// import FilterPanel from '../DONTUSE_PrettyFilterComponent';
import SessionLineChart from '../graphs/PlayerSessionLineGraph';
import FPSOverTime from '../graphs/FPSPlayerScatter';
import FPSLineChart from '../graphs/AverageFPSOverTime';
import TuneIcon from '@mui/icons-material/Tune';
import FilterDrawer from '../FilterComponent';
import GaugeChart from '../graphs/GaugeChart';
import PlayerSessionStats from '../graphs/SessionTable';


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

function ToolbarActions() {
  const [openFilter, setOpenFilter] = useState(false);
  return (
    <>
    <Stack direction="row" spacing={2}>
      {/* <BasicFilterSelect /> */}
      <IconButton onClick={() => setOpenFilter(true)}>
        <TuneIcon />
      </IconButton>
      <ToolbarActionsSearch />
    </Stack>

    <FilterDrawer open={openFilter} onClose={() => setOpenFilter(false)} />
    </>
  );
}

const toggleSidebar = () => {
  setSidebarExpanded(!sidebarExpanded);
};

function DashboardLayoutBasic() {
    const router = useDemoRouter('/dashboard');
  
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
    
<DashboardLayout slots={{ toolbarActions: () => <ToolbarActions setOpenFilter={setOpenFilter} /> }}>
        <DashboardContent pathname={router.pathname} sx={{ backgroundColor: '#f7f7f7' }}>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
            <CardComponent title="Average FPS"sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', minHeight: '200px', maxHeight: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><AverageFPS filter={filter} /></CardComponent>
            <CardComponent title="Average Player Return" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', maxHeight: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><Box sx={{ mt: '-40px' }}><GaugeChartComp filter={filter}/></Box></CardComponent>
            <CardComponent title="Average Session Length" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', minHeight: '240px', maxHeight: '300px', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true} fixed={true}><AverageSessionLength filter={filter} /></CardComponent>
            <CardComponent title="Environment Interaction" description="Quantifies player interactions with game elements" centerContent><PlayerInteractionsBarGraph filter={filter} /></CardComponent>
            <CardComponent title="Player Retention" description="Measures return rates based on how many sessions a player has logged in for" centerContent><PlayerRetentionGraph filter={filter} /></CardComponent>
            <CardComponent title="Item Usage" description="Displays the distribution of player item usage" pieBottom centerContent><BasicPie filter={filter} /></CardComponent>
            <CardComponent title="Player Session Statistics" description="Summarizes player session data with key metrics"  sx={{ flex: '1 1 600px', maxWidth: '600px', minWidth: '400px', minHeight: '380px' }} centerContent><PlayerSessionStats filter={filter} /></CardComponent>
            <CardComponent title="FPS Performance Scatterplot" description="Tracks frame rate patterns across multiple players and dates" centerContent><FPSOverTime filter={filter} /></CardComponent>
            <CardComponent title="Average FPS Timeline" description="Player FPS averages grouped by day over time" centerContent><FPSLineChart filter={filter} /></CardComponent>
            <CardComponent title="Player Location" description="Visualizes player movement density across the game map"  sx={{ flex: '1 1 600px', maxWidth: '700px', minWidth: '400px', minHeight: '380px'}} centerContent={false}><ApexChart filter={filter} /></CardComponent>
            <CardComponent title="Player Session Length" description="Illustrates player session lengths grouped by game version patches" centerContent><AverageSessionPerDayChart filter={filter} /></CardComponent>
            <CardComponent title="Average Return Time" description="Measures return rates based on last login timestamps" sx={{ flex: '1 1 300px', maxWidth: '360px', minWidth: '300px', maxHeight: '300px'}}  centerContent><AverageReturnTimeGraph filter={filter} /></CardComponent>
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
}

// DashboardLayoutBasic.propTypes = {
//   /**
//    * Injected by the documentation to work in an iframe.
//    * Remove this when copying and pasting into your project.
//    */
//   window: PropTypes.func,
// };

export default DashboardLayoutBasic;
