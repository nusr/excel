import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import 'excel-collab/style.css';
import './sentry';
import { WebsocketProvider } from 'y-websocket';
import { Excel, StateContext, Button, initController } from 'excel-collab';
import { Doc } from 'yjs';
import Worker from 'excel-collab/worker?worker';
import { jumpPage, getDocId, getProvider } from './util';
import { VITE_WEBSOCKET_URL } from './constant';

const callback = async (_: any, id: string) => {
  location.hash = `#${id}`;
  location.reload();
};

async function init() {
  const provider = await getProvider(callback);

  const docId = getDocId();
  location.hash = `#${docId}`;
  const doc = new Doc({ guid: docId });

  let webSocket: WebsocketProvider | null = null;
  if (VITE_WEBSOCKET_URL) {
    webSocket = new WebsocketProvider(VITE_WEBSOCKET_URL, doc.guid, doc, {
      connect: false,
    });
  }

  webSocket?.connect();

  const controller = initController({
    worker: new Worker(),
    doc,
  });

  (window as any).controller = controller;
  (window as any).provider = provider;
  (window as any).doc = doc;
  (window as any).webSocket = webSocket;

  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <div style={{ height: '100vh' }}>
        <StateContext.Provider
          value={{ provider, controller, awareness: webSocket?.awareness }}
        >
          <Excel
            menubarLeftChildren={
              window.self === window.top && (
                <div style={{ display: 'flex' }}>
                  <Button
                    onClick={() => {
                      jumpPage('');
                    }}
                    style={{ marginLeft: 10, marginRight: 10 }}
                  >
                    Home
                  </Button>
                  <Button
                    onClick={() => {
                      jumpPage('collab', getDocId());
                    }}
                  >
                    Collaboration
                  </Button>
                </div>
              )
            }
          />
        </StateContext.Provider>
      </div>
    </StrictMode>,
  );
}
init();
