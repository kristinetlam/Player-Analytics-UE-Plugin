import './App.css'
import BasicBars from './components/graphs/BarGraph'
import BasicLineChart from './components/graphs/LineGraph'
import BasicPie from './components/graphs/PieChart'
import BasicScatter from './components/graphs/ScatterPlot'
import CardComponent from './components/CardComponent'
// import Header from './components/header/Header'
import DashboardLayoutBasic from './components/dashboard/Dashboard'

function App() {
  return (
    <DashboardLayoutBasic>
      <div className="charts-container">
        <CardComponent>
          <BasicBars />
        </CardComponent>
        <CardComponent>
          <BasicLineChart />
        </CardComponent>
        <CardComponent>
          <BasicPie />
        </CardComponent>
        <CardComponent>
          <BasicScatter />
        </CardComponent>
        {/* Add more charts here if needed */}
      </div>
    </DashboardLayoutBasic>
  );
}

export default App
