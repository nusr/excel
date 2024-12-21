import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  copyOrCut,
  paste,
  type WorkerMethod,
  AppWithCollaboration,
  DEFAULT_EXCEL_ID,
} from 'excel-collab';
import 'excel-collab/style.css';
import './sentry';
import Worker from './worker?worker';

const workerInstance = wrap<WorkerMethod>(new Worker());

const docId = import.meta.env.VITE_DEFAULT_EXCEL_ID || DEFAULT_EXCEL_ID;
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
