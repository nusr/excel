import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  App,
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  getDocId,
} from '@excel/react';
import '@excel/react/style.css';
import { copyOrCut, paste, type WorkerMethod } from '@excel/shared';
import './sentry';
import Worker from './worker?worker';

const workerInstance = wrap<WorkerMethod>(new Worker());

async function initView() {
  const docId = getDocId(import.meta.env.VITE_DEFAULT_EXCEL_ID);
  location.hash = `#${docId}`;
  const doc = initDoc({ guid: docId });
  const { isServer, provider } = await initCollaboration(doc);
  const controller = initController({
    copyOrCut,
    paste,
    worker: workerInstance,
    doc,
  });
  controller.setCurrentSheetId(controller.getCurrentSheetId());
  (window as any).controller = controller;
  (window as any).doc = doc;

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
  document.head.append(`<!-- ${process.env.COMMIT_LOG} --> `);
  document.getElementById('loading')?.remove();
}
initView();
