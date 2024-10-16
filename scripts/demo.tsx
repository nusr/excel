import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
import { createRoot } from 'react-dom/client';
import React, { StrictMode } from 'react';
import {
  App,
  initController,
  copyOrCut,
  paste,
  MOCK_MODEL,
  WorkerMethod,
  initCollaboration,
  IController,
} from '../src';
import * as Comlink from 'comlink';

declare const window: {
  controller: IController;
} & Window;

if (typeof Worker !== 'function') {
  throw new Error("Don't support Web Worker");
}

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

const controller = initController(true, {
  copyOrCut,
  paste,
  worker: Comlink.wrap<WorkerMethod>(
    new Worker('./worker.js', { type: 'module', name: 'worker' }),
  ),
});
window.controller = controller;
createRoot(domNode).render(
  <StrictMode>
    <App controller={controller} />
  </StrictMode>,
);
controller.fromJSON(MOCK_MODEL);
initCollaboration(controller);
