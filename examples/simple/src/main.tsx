import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  getDocId,
  copyOrCut,
  paste,
  type WorkerMethod,
  AppWithCollaboration,
} from 'excel-collab';
import Worker from './worker?worker';
import 'excel-collab/style.css'

const workerInstance = wrap<WorkerMethod>(new Worker());

const docId = getDocId();
location.hash = `#${docId}`;
const doc = initDoc({ guid: docId });
const provider = initCollaboration(doc);
const controller = initController({
  copyOrCut,
  paste,
  worker: workerInstance,
  doc,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <AppWithCollaboration />
    </StateContext>
  </StrictMode>,
);
