import { createRoot } from 'react-dom/client';
import { StrictMode, useState } from 'react';
import 'excel-collab/style.css';
import './sentry';
import { WebsocketProvider } from 'y-websocket';
import { Excel, Doc, type ExcelProps, Button } from 'excel-collab';
import { PROTOCOL_VERSION } from 'excel-collab/protocol';
import { getDocId, getProvider } from './util';
import { VITE_WEBSOCKET_URL } from './constant';
import { List } from './List';
import { type IProvider } from './provider';
import * as Sentry from '@sentry/react';

const callback = async (_: any, id: string) => {
  location.hash = `#${id}`;
  location.reload();
};

function App(props: Omit<ExcelProps, 'provider'> & { provider: IProvider }) {
  const [isList, setIsList] = useState(false);

  if (isList) {
    return (
      <List
        {...props}
        changePage={(id: string) => {
          callback({}, id);
        }}
      />
    );
  }
  return (
    <Excel
      {...props}
      menubarLeftChildren={
        <div style={{ paddingLeft: 8 }}>
          <Button onPress={() => setIsList(true)} aria-label="Home">
            Home
          </Button>
        </div>
      }
    />
  );
}

async function init() {
  const provider = await getProvider(callback);

  const docId = getDocId();

  let doc = undefined;

  let webSocket: WebsocketProvider | null = null;
  if (VITE_WEBSOCKET_URL) {
    doc = new Doc({ guid: docId });
    webSocket = new WebsocketProvider(VITE_WEBSOCKET_URL, docId, doc, {
      params: { protocol: String(PROTOCOL_VERSION) },
    });
  }

  webSocket?.connect();
  const whenSynced = webSocket ? new Promise<void>((resolve) => {
    const connection = webSocket;
    if (connection.synced) { resolve(); return; }
    const handleSync = (synced: boolean) => {
      if (synced) {
        connection.off('sync', handleSync);
        resolve();
      }
    };
    connection.on('sync', handleSync);
  }) : undefined;

  (window as any).provider = provider;
  (window as any).webSocket = webSocket;

  const container = document.getElementById('root')!;

  const root = createRoot(container, {
    // Callback called when an error is thrown and not caught by an ErrorBoundary.
    onUncaughtError: Sentry.reactErrorHandler((error, errorInfo) => {
      console.warn('Uncaught error', error, errorInfo.componentStack);
    }),
    // Callback called when React catches an error in an ErrorBoundary.
    onCaughtError: Sentry.reactErrorHandler(),
    // Callback called when React automatically recovers from errors.
    onRecoverableError: Sentry.reactErrorHandler(),
  });

  root.render(
    <StrictMode>
      <App
        provider={provider}
        awareness={webSocket?.awareness}
        doc={doc}
        whenSynced={whenSynced}
        docConfig={{ guid: docId }}
        style={{ height: '100vh' }}
      />
    </StrictMode>,
  );
  window.addEventListener('beforeunload', () => {
    root.unmount();
    webSocket?.destroy();
    doc?.destroy();
  }, { once: true });
}
init();
