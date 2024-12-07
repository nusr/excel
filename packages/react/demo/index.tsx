import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initDoc,
  wrap,
  initCollaboration,
  App,
} from '../src';
import { copyOrCut, paste, WorkerMethod } from '@excel/shared';
import Worker from './worker?worker';

const doc = initDoc({});
const provider = initCollaboration(doc);
const controller = initController({
  copyOrCut,
  paste,
  worker: wrap<WorkerMethod>(new Worker()),
  doc,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext.Provider value={{ provider, controller }}>
      <App />
    </StateContext.Provider>
  </StrictMode>,
);
