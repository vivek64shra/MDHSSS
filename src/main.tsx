import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import mdhssCloud from './firebase.ts';

// Initialize real-time cloud data synchronization immediately for ultra-fast notification & live updates
if (typeof window !== 'undefined') {
  const initSync = () => {
    try {
      mdhssCloud.setupRealtimeSync();
      console.log('🚀 Maa Durga School Cloud Database connected (Project:', mdhssCloud.projectId, ')');
    } catch (e) {
      console.info('Cloud sync notice:', e);
    }
  };

  // Launch instantly without any artificial delay
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSync);
  } else {
    initSync();
  }
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

