import * as React from 'react';
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
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useDemoRouter } from '@toolpad/core/internal';
import BasicBars from '../graphs/BarGraph';
import BasicLineChart from '../graphs/LineGraph';
import BasicPie from '../graphs/PieChart';
import BasicScatter from '../graphs/ScatterPlot';
import CardComponent from '../CardComponent';
import DashboardContent from './DashboardContent';
import { Card } from '@mui/material';
import ApexChart from '../graphs/Heatmap';
import CompositionExample from '../graphs/GaugeChart';
import AverageFPS from '../graphs/AverageFPS';
import AverageSessionLength from '../graphs/AverageSessionLength';

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
  colorSchemes: { light: true, dark: true },
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

function DashboardLayoutBasic() {
    const router = useDemoRouter('/dashboard');
  
    return (
      <AppProvider navigation={NAVIGATION} router={router} theme={demoTheme}>
        <DashboardLayout>
          <DashboardContent pathname={router.pathname} sx={{backgroundColor: '#f7f7f7'}}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
              {/* Add filters for users with dropdowns */}
              {/* Put small cards with numbers and small graphs like this at top of dashboard*/}
              <CardComponent title="Average FPS" sx={{ width: '30%', height: '15%', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false}centerContent={true}>{/* <CompositionExample /> */}
                <AverageFPS />
              </CardComponent> 
              <CardComponent title="Average Player Return" description="over past 30 days" sx={{ width: '30%', height: '15%', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true}></CardComponent>
              <CardComponent title="Average Session Length" sx={{ width: '30%', height: '15%', display: 'flex', flexDirection: 'column' }} moveTitleUp={true} marginBottom={false} centerContent={true}><AverageSessionLength /></CardComponent>
              <CardComponent title="Environment Interaction" description="Quantifies player interactions with game elements"><BasicBars /></CardComponent>
              <CardComponent title="Player Retention" description="Measures return rates based on last login timestamps"><BasicLineChart /></CardComponent>
              <CardComponent title="Item Usage" description="Displays the distribution of player item usage"><BasicPie /></CardComponent>
              <CardComponent title="Player Session Length" description="Illustrates player session lengths grouped by game version patches"><BasicScatter /></CardComponent>
              <CardComponent title="Player Location" description="Visualizes player movement density across the game map" sx={{ width: '70%'}} centerContent={false}><ApexChart/></CardComponent>
            </Box>
          </DashboardContent>
        </DashboardLayout>
      </AppProvider>
    );
  }

DashboardLayoutBasic.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default DashboardLayoutBasic;
