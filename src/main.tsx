import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import mdhssCloud from './firebase.ts';

// Initialize real-time cloud data synchronization smoothly after page hydration
if (typeof window !== 'undefined') {
  const initSync = () => {
    try {
      mdhssCloud.setupRealtimeSync();
      console.log('🚀 Maa Durga School Cloud Database connected (Project:', mdhssCloud.projectId, ')');
    } catch (e) {
      console.info('Cloud sync deferred notice:', e);
    }
  };

  if (document.readyState === 'complete') {
    setTimeout(initSync, 1000);
  } else {
    window.addEventListener('load', () => setTimeout(initSync, 1000));
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

