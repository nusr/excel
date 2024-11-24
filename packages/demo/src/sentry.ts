import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';

if (location.hostname === 'nusr.github.io') {
  init({
    dsn: 'https://b292d91ba509038c141ecfc7d10e7bb7@o4506851168092160.ingest.sentry.io/4506851171041280',
    integrations: [
      browserTracingIntegration(),
      replayIntegration({
        maskAllText: false,
        blockAllMedia: false,
      }),
    ],
    tracesSampleRate: 1.0,
    tracePropagationTargets: ['nusr.github.io'],
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}
