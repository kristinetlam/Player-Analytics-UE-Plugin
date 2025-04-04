import './App.css'
import BasicBars from './components/graphs/BarGraph'
import BasicLineChart from './components/graphs/LineGraph'
import BasicPie from './components/graphs/PieChart'
import BasicScatter from './components/graphs/ScatterPlot'
import CardComponent from './components/CardComponent'
// import Header from './components/header/Header'
import DashboardLayoutBasic from './components/dashboard/Dashboard'
import DoughnutChart from './components/graphs/DoughnutChart'

function App() {
  return (
    <DashboardLayoutBasic>
      {/* <div className="charts-container">
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
        <CardComponent>
          <DoughnutChart />
        </CardComponent>
      </div> */}
    </DashboardLayoutBasic>
  );
}

export default App
