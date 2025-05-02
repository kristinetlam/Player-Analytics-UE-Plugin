import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';

/**
 * Entry point for the React application.
 * 
 * This file initializes the React root and renders the main App component 
 * inside React's StrictMode, which helps identify potential issues 
 * in the application during development.
 */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
