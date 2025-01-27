import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { Excel, StateContext, initController } from '../src/index';
import Worker from '../src/worker?worker';
import * as Y from 'yjs';

const controller = initController({
  worker: new Worker(),
  doc: new Y.Doc(),
});

(window as any).controller = controller;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh' }}>
      <StateContext value={{ controller }}>
        <Excel />
      </StateContext>
    </div>
  </StrictMode>,
);
