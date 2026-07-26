import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initMockDatabase } from './mockApi.ts';

// Catch and suppress benign Vite/WebSocket network errors which are expected in sandboxed preview environments.
window.addEventListener('unhandledrejection', (event) => {
  const reason = event.reason;
  const message = reason?.message || String(reason || '');
  if (
    message.includes('WebSocket') || 
    message.includes('websocket') || 
    message.includes('vite') ||
    message.includes('Vite') ||
    message.includes('HMR')
  ) {
    event.preventDefault();
    event.stopPropagation();
    console.warn('Suppressed benign sandbox WebSocket/HMR rejection:', message);
  }
});

window.addEventListener('error', (event) => {
  const message = event.message || '';
  if (
    message.includes('WebSocket') || 
    message.includes('websocket') || 
    message.includes('vite') ||
    message.includes('Vite') ||
    message.includes('HMR')
  ) {
    event.preventDefault();
    event.stopPropagation();
    console.warn('Suppressed benign sandbox WebSocket/HMR error:', message);
  }
});

// Initialize the resilient fallback database & API interceptor
initMockDatabase();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
