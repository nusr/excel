import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  App,
  initController,
  StateContext,
  initDoc,
  wrap,
} from '../src/index';
import { copyOrCut, paste, WorkerMethod } from '@excel/shared';
import '../src/global.css';
import Worker from './worker?worker';

const doc = initDoc({});
const controller = initController({
  copyOrCut,
  paste,
  worker: wrap<WorkerMethod>(new Worker()),
  doc,
});
controller.addSheet();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext.Provider
      value={{
        controller,
        isServer: false,
      }}
    >
      <App />
    </StateContext.Provider>
  </StrictMode>,
);
