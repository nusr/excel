import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  App,
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
} from '@excel/react';
import '@excel/react/style';
import { copyOrCut, paste, getDocId, type WorkerMethod } from '@excel/shared';
import './sentry';
import Worker from './worker?worker';

console.log(import.meta.env);

const workerInstance = wrap<WorkerMethod>(new Worker());

async function initView() {
  const docId = getDocId();
  location.hash = `#${docId}`;
  const doc = initDoc({ guid: docId });
  const { isServer, provider } = await initCollaboration(doc);
  const controller = initController({
    copyOrCut,
    paste,
    worker: workerInstance,
    doc,
  });

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
  document.body.append(`<!-- ${process.env.COMMIT_LOG} --> `);
  setTimeout(() => {
    document.getElementById('loading')?.remove();
  }, 0);
}
initView();
