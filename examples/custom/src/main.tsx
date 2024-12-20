import { createRoot } from 'react-dom/client';
import { StrictMode, memo, useState, useEffect } from 'react';
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
  MenuBarContainer,
  ToolbarContainer,
  FormulaBarContainer,
  CanvasContainer,
  SheetBarContainer,
  ProviderStatus,
  useExcel,
  fileStore,
  applyUpdate,
  eventEmitter,
  userStore,
  Loading,
} from 'excel-collab';
import Worker from './worker?worker';
import 'excel-collab/style.css';

const App = memo(() => {
  const [isLoading, setIsLoading] = useState(true);
  const [providerStatus, setProviderStatus] = useState<ProviderStatus>(
    ProviderStatus.LOCAL,
  );
  const { provider, controller } = useExcel();
  useEffect(() => {
    async function init() {
      if (!provider) {
        return;
      }
      setIsLoading(true);
      const file = await provider?.getDocument();
      fileStore.setState({
        id: file?.id ?? '',
        name: file?.name ?? '',
        clientId: provider.doc.clientID,
      });
      const result = await provider?.retrieveHistory();
      if (result.length > 0) {
        applyUpdate(provider.doc, result);
      } else if (controller.getSheetList().length === 0) {
        controller.addFirstSheet();
      }
      setIsLoading(false);
    }
    init();
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
    eventEmitter.on('awarenessChange', ({ users }) => {
      userStore.setState(users);
    });
    return () => {
      window.removeEventListener('online', handleEvent);
      window.removeEventListener('online', handleEvent);
      eventEmitter.off('awarenessChange');
    };
  }, [provider]);
  if (isLoading) {
    return <Loading />;
  }
  return (
    <div data-testid="app-container">
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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <App />
    </StateContext>
  </StrictMode>,
);
