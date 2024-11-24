import {
  init,
  browserTracingIntegration,
  replayIntegration,
} from '@sentry/react';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './containers';
import { type IController, type WorkerMethod } from './types';
import { copyOrCut, paste, getDocId } from './util';
import { initController } from './controller';
import * as Comlink from 'comlink';
import './global.css';
import Worker from './worker?worker';
import * as Y from 'yjs';
import { initCollaboration } from './collaboration';
import { StateContext } from './containers';

declare const window: {
  controller: IController;
  doc: Y.Doc;
} & Window;

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

async function initView() {
  const docId = getDocId();
  location.hash = `#${docId}`;
  const doc = new Y.Doc({ guid: docId });

  const { isServer, provider } = await initCollaboration(doc);
  const controller = initController({
    copyOrCut,
    paste,
    worker: Comlink.wrap<WorkerMethod>(new Worker()),
    doc,
  });

  window.controller = controller;
  window.doc = doc;
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <StateContext.Provider
        value={{
          controller,
          isServer,
          updateFile: provider.updateFile,
          downloadFile: provider.downloadFile,
        }}
      >
        <App />
      </StateContext.Provider>
    </StrictMode>,
  );
}
initView();
