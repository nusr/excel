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
  App,
} from 'excel-collab';
import Worker from './worker?worker';
import 'excel-collab/style.css';

const workerInstance = wrap<WorkerMethod>(new Worker());

const doc = initDoc();
const provider = initCollaboration(doc);
const controller = initController({
  copyOrCut,
  paste,
  worker: workerInstance,
  doc,
});
controller.addFirstSheet()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <App />
    </StateContext>
  </StrictMode>,
);
