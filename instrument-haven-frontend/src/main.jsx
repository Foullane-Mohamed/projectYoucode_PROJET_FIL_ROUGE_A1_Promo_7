// src/main.jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Create a single global placeholder image
window.PLACEHOLDER_IMAGE = '/placeholder.png';

// Set up API base URL globally
window.API_BASE_URL = 'http://localhost:8000';
window.API_STORAGE_URL = `${window.API_BASE_URL}/storage`;

// Configure logging for development
if (import.meta.env.DEV) {
  console.log('Running in development mode');
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)