import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import mdhssCloud from './firebase.ts';

// Initialize real-time cloud data synchronization across all devices
try {
  mdhssCloud.setupRealtimeSync();
  console.log('🚀 Maa Durga School Cloud Database connected (Project:', mdhssCloud.projectId, ')');
} catch (e) {
  console.warn('Cloud sync initialization notice:', e);
}

// Mount to #student-analytics-root if present, otherwise #root
const container = document.getElementById('student-analytics-root') || document.getElementById('root');

if (container) {
  createRoot(container).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

