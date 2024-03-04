import { App } from './containers';
import './global.css';
import ReactDOM from 'react-dom/client';
import React from 'react';
import { initController } from '@/controller';
import { theme } from './util';
import { MOCK_MODEL } from '@/model';
import * as Sentry from '@sentry/react';

function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ''));
  }
}

Sentry.init({
  dsn: 'https://b292d91ba509038c141ecfc7d10e7bb7@o4506851168092160.ingest.sentry.io/4506851171041280',
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: ['localhost', 'nusr.github.io'],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

const domNode = document.getElementById('root')!;
initTheme(document.documentElement);
const controller = initController();
controller.fromJSON(MOCK_MODEL);
const root = ReactDOM.createRoot(domNode);

root.render(
  <React.StrictMode>
    <App controller={controller} />
  </React.StrictMode>,
);
