import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ButtonUsage from './test.jsx'
import BasicHeatmap from './components/graphs/line_graph.jsx'
import BasicLineChart from './components/graphs/line_graph.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <BasicLineChart />
    <ButtonUsage />
  </StrictMode>,
)
