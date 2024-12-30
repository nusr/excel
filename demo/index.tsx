import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import {
  initController,
  StateContext,
  initDoc,
  wrap,
  type WorkerMethod,
  Excel,
  version,
  useUserInfo,
} from '../src';
import Worker from './worker?worker';
import './sentry';
import { CollaborationProvider } from './server';
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from 'y-webrtc';

const workerInstance = wrap<WorkerMethod>(new Worker());

const docId =
  import.meta.env.VITE_DEFAULT_EXCEL_ID ||
  '184858c4-be37-41b5-af82-52689004e605';
const doc = initDoc({ guid: docId });
location.hash = `#${docId}`;

const providerType = new URLSearchParams(location.search).get('providerType');

let provider: CollaborationProvider | undefined = undefined;
if (providerType === 'websocket') {
  const websocketProvider = new WebsocketProvider(
    'ws://localhost:1234',
    doc.guid,
    doc,
  );

  websocketProvider.on('status', (...args) => {
    console.log('status:', ...args);
  });
  websocketProvider.on('sync', (...args) => {
    console.log('sync:', ...args);
  });
  console.log('websocketProvider', websocketProvider);
} else if (providerType === 'webrtc') {
  const webrtcProvider = new WebrtcProvider(doc.guid, doc, {
    signaling: ['ws://localhost:4444'],
  });

  webrtcProvider.on('synced', (...args) => {
    console.log('synced:', ...args);
  });
  webrtcProvider.on('peers', (...args) => {
    console.log('peers:', ...args);
  });
  webrtcProvider.on('status', (...args) => {
    console.log('status:', ...args);
  });
  console.log('webrtcProvider', webrtcProvider);
} else {
  provider = new CollaborationProvider({
    doc,
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    enableIndexDb: false,
  });

  provider.setAwarenessChangeCallback((users) => {
    useUserInfo.getState().setUsers(users);
  });
}

const controller = initController({
  worker: workerInstance,
  doc,
});
(window as any).controller = controller;
(window as any).doc = doc;
(window as any).version = version;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ provider, controller }}>
      <Excel />
    </StateContext>
  </StrictMode>,
);
