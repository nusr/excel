import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './containers';
import { type IController, type WorkerMethod } from './types';
import { MOCK_MODEL } from './model';
import { copyOrCut, paste } from './util';
import { initController } from './controller';
import { initCollaboration } from './collaboration';
import * as Comlink from 'comlink';
import './global.css';

declare const window: {
  controller: IController;
} & Window;

if (typeof Worker !== 'function') {
  throw new Error("Don't support Web Worker");
}

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

const domNode = document.getElementById('root')!;

const controller = initController(true, {
  copyOrCut,
  paste,
  worker: Comlink.wrap<WorkerMethod>(
    new Worker(new URL('./worker.js', import.meta.url), {
      type: 'module',
      name: 'worker',
    }),
  ),
});
window.controller = controller;
controller.fromJSON(MOCK_MODEL);
initCollaboration(controller);

createRoot(domNode).render(
  <StrictMode>
    <App controller={controller} />
  </StrictMode>,
);
