import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import AdminPortalApp from './components/admin/AdminPortalApp.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import './index.css';
import mdhssCloud from './firebase.ts';

function bootPortalEngine() {
  // 1. Launch real-time Firestore onSnapshot listeners immediately
  try {
    mdhssCloud.setupRealtimeSync();
  } catch (e) {
    console.info('Cloud sync notice:', e);
  }

  // 2. Mount React + Tailwind + Firestore Admin & Staff Portal inside #react-admin-portal-root
  const adminContainer = document.getElementById('react-admin-portal-root');
  if (adminContainer && !adminContainer.dataset.mounted) {
    adminContainer.dataset.mounted = 'true';
    createRoot(adminContainer).render(
      <StrictMode>
        <ErrorBoundary>
          <AdminPortalApp />
        </ErrorBoundary>
      </StrictMode>
    );
  }

  // 3. Preserve existing #student-analytics-root mount if present
  const analyticsContainer =
    document.getElementById('student-analytics-root') || document.getElementById('root');
  if (analyticsContainer && !analyticsContainer.dataset.mounted) {
    analyticsContainer.dataset.mounted = 'true';
    createRoot(analyticsContainer).render(
      <StrictMode>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </StrictMode>
    );
  }
}

if (typeof window !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootPortalEngine);
  } else {
    bootPortalEngine();
  }
}
