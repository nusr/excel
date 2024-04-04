import { App } from './containers';
import './global.css';
import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import { initController } from '@/controller';
import { MOCK_MODEL } from '@/model';
import { allFormulas } from './formula';

function initSentry() {
  if (location.hostname === 'localhost') {
    return;
  }
  import('@sentry/react').then((sentry) => {
    sentry.init({
      dsn: 'https://b292d91ba509038c141ecfc7d10e7bb7@o4506851168092160.ingest.sentry.io/4506851171041280',
      integrations: [
        sentry.browserTracingIntegration(),
        sentry.replayIntegration({
          maskAllText: false,
          blockAllMedia: false,
        }),
      ],
      // Performance Monitoring
      tracesSampleRate: 1.0, //  Capture 100% of the transactions
      // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
      tracePropagationTargets: ['nusr.github.io'],
      // Session Replay
      replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
      replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
  });
}

function initExcel(rootId = 'root') {
  const domNode = document.getElementById(rootId)!;
  const controller = initController(true);
  const root = createRoot(domNode);
  root.render(
    <StrictMode>
      <App controller={controller} />
    </StrictMode>,
  );
  return controller;
}

export default { initExcel, defaultModel: MOCK_MODEL, initSentry, allFormulas };
