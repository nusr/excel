import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import 'excel-collab/style.css';
import './sentry';
import { initControllerState } from './collab';
import { Excel, StateContext } from 'excel-collab';
import { RemoteProvider, LocalProvider } from './provider';

const callback = (id: string) => {
  location.hash = `#${id}`;
  location.reload();
};

const httpBaseUrl = import.meta.env.VITE_HTTP_BASE_URL;
const provider = httpBaseUrl
  ? new RemoteProvider(httpBaseUrl, callback)
  : new LocalProvider(callback);

const controller = initControllerState();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <div style={{ height: '100vh' }}>
        <Excel />
      </div>
    </StateContext>
  </StrictMode>,
);
