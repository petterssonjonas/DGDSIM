import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

const TestSceneViewer = lazy(() =>
  import('./scene/TestSceneViewer').then((m) => ({ default: m.TestSceneViewer }))
);

// Dev only: add ?test to URL to preview the Spline scene in isolation
const isTestMode = import.meta.env.DEV && new URLSearchParams(window.location.search).has('test');

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found in DOM');

createRoot(rootEl).render(
  <StrictMode>
    {isTestMode ? (
      <Suspense fallback={<div>Loading test scene...</div>}>
        <TestSceneViewer />
      </Suspense>
    ) : (
      <App />
    )}
  </StrictMode>,
);
