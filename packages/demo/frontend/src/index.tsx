import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import 'excel-collab/style.css';
import './sentry';
import { WebsocketProvider } from 'y-websocket';
import { Excel, Doc } from 'excel-collab';
import { getDocId, getProvider } from './util';
import { VITE_WEBSOCKET_URL } from './constant';

const callback = async (_: any, id: string) => {
  location.hash = `#${id}`;
  location.reload();
};

async function init() {
  const provider = await getProvider(callback);

  const docId = getDocId();

  let doc = undefined;

  let webSocket: WebsocketProvider | null = null;
  if (VITE_WEBSOCKET_URL) {
    doc = doc = new Doc({ guid: docId });
    webSocket = new WebsocketProvider(VITE_WEBSOCKET_URL, docId, doc);
  }

  webSocket?.connect();

  (window as any).provider = provider;
  (window as any).webSocket = webSocket;

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Excel
        provider={provider}
        awareness={webSocket?.awareness}
        doc={doc}
        docConfig={{ guid: docId }}
        style={{ height: '100vh' }}
      />
    </StrictMode>,
  );
}
init();
