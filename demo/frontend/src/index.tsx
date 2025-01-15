import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import 'excel-collab/style.css';
import './sentry';
import { initControllerState } from './collab';
import { Excel, StateContext, Button } from 'excel-collab';
import { RemoteProvider, LocalProvider } from './provider';
import { jumpPage, getDocId } from './util';

const callback = async (id: string) => {
  location.hash = `#${id}`;
  location.reload();
};

const httpBaseUrl = import.meta.env.VITE_BACKEND_URL;
const provider = httpBaseUrl
  ? new RemoteProvider(httpBaseUrl, callback)
  : new LocalProvider(callback);

const { controller, doc } = initControllerState();

(window as any).controller = controller;
(window as any).provider = provider;
(window as any).doc = doc;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <div style={{ height: '100vh' }}>
      <StateContext value={{ provider, controller }}>
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
      </StateContext>
    </div>
  </StrictMode>,
);
