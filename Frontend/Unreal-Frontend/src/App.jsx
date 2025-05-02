import './App.css';
import DashboardLayoutBasic from './components/dashboard/Dashboard';

/**
 * The main application component.
 * 
 * This component serves as the root of the React app and renders the
 * primary layout component, `DashboardLayoutBasic`, which contains the main UI.
 * 
 * @returns {JSX.Element} The rendered root application component.
 */
function App() {
  return (
    <DashboardLayoutBasic />
  );
}

export default App;
