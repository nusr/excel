import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initDoc,
  wrap,
  getDocId,
  copyOrCut,
  paste,
  type WorkerMethod,
  App,
} from '../src';
import './sentry';
import Worker from './worker?worker';

const workerInstance = wrap<WorkerMethod>(new Worker());

const docId = getDocId();
const doc = initDoc({ guid: docId });
const controller = initController({
  copyOrCut,
  paste,
  worker: workerInstance,
  doc,
});
controller.addFirstSheet();
(window as any).controller = controller;
(window as any).doc = doc;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ controller }}>
      <App />
    </StateContext>
  </StrictMode>,
);
