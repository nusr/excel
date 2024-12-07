import { createRoot } from 'react-dom/client';
import { StrictMode, memo, useEffect, useState } from 'react';
import {
  initController,
  StateContext,
  initCollaboration,
  initDoc,
  wrap,
  getDocId,
  MenuBarContainer,
  ToolbarContainer,
  CanvasContainer,
  FormulaBarContainer,
  SheetBarContainer,
  useExcel,
  applyUpdate,
  Loading,
  ProviderStatus,
} from '@excel/react';
import '@excel/react/style.css';
import { copyOrCut, paste, type WorkerMethod } from '@excel/shared';
import './sentry';
import Worker from './worker?worker';

const App = memo(() => {
  const [isLoading, setIsLoading] = useState(false);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>(
    ProviderStatus.LOCAL,
  );
  const { provider, controller } = useExcel();
  useEffect(() => {
    setIsLoading(true);
    provider
      ?.retrieveHistory()
      .then((result: Uint8Array[]) => {
        if (result.length > 0) {
          applyUpdate(provider.doc, result);
        } else {
          controller.addSheet();
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [provider, controller]);

  useEffect(() => {
    function handleEvent() {
      if (provider?.isOnline()) {
        setProviderStatus(ProviderStatus.SYNCING);
        provider
          ?.syncData()
          .finally(() =>
            setProviderStatus(
              provider?.isOnline()
                ? ProviderStatus.ONLINE
                : ProviderStatus.LOCAL,
            ),
          );
      }
    }
    window.addEventListener('online', handleEvent);
    window.addEventListener('offline', handleEvent);
    return () => {
      window.removeEventListener('online', handleEvent);
      window.removeEventListener('online', handleEvent);
    };
  }, [provider]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <div
      style={{
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
      data-testid="app-container"
    >
      <MenuBarContainer providerStatus={providerStatus} />
      <ToolbarContainer />
      <FormulaBarContainer />
      <CanvasContainer />
      <SheetBarContainer />
    </div>
  );
});

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
(window as any).controller = controller;
(window as any).doc = doc;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext.Provider value={{ provider, controller }}>
      <App />
    </StateContext.Provider>
  </StrictMode>,
);
document.head.append(`<!-- ${process.env.COMMIT_LOG} --> `);
