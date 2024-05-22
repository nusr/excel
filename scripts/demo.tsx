import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import { App, initController, copyOrCut, paste, MOCK_MODEL } from '../src';

if (location.hostname !== 'localhost') {
  init({
    dsn: 'https://b292d91ba509038c141ecfc7d10e7bb7@o4506851168092160.ingest.sentry.io/4506851171041280',
    integrations: [
      browserTracingIntegration(),
      replayIntegration({
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
}

const domNode = document.getElementById('root')!;

const isUseWorker = true;

const worker: Worker | undefined =
  isUseWorker && typeof Worker === 'function'
    ? new Worker('./worker.js')
    : undefined;

const controller = initController(true, { copyOrCut, paste }, worker);
(window as any).controller = controller;
createRoot(domNode).render(
  <StrictMode>
    <App controller={controller} />
  </StrictMode>,
);
controller.fromJSON(MOCK_MODEL);
