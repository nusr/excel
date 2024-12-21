import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  DEFAULT_EXCEL_ID,
  copyOrCut,
  paste,
  type WorkerMethod,
  AppWithCollaboration,
} from '../src';
import Worker from './worker?worker';

const workerInstance = wrap<WorkerMethod>(new Worker());

const docId = DEFAULT_EXCEL_ID;
location.hash = `#${docId}`;
const doc = initDoc({ guid: docId });
const provider = initCollaboration(doc);
const controller = initController({
  copyOrCut,
  paste,
  worker: workerInstance,
  doc,
});
(window as any).controller = controller;
(window as any).doc = doc;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <AppWithCollaboration />
    </StateContext>
  </StrictMode>,
);
