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
  UserItem,
  useUserInfo,
  modelToChangeSet,
} from '../src';
import Worker from './worker?worker';
import './sentry';
import { WebsocketProvider } from 'y-websocket';
import { Provider } from './provider';

const docId =
  import.meta.env.VITE_DEFAULT_EXCEL_ID ||
  '184858c4-be37-41b5-af82-52689004e605';
const doc = initDoc({ guid: docId });
location.hash = `#${docId}`;

// Github Pages no server
const isCI = Boolean(process.env.CI);

const webSocket = new WebsocketProvider(
  isCI ? '' : 'ws://localhost:1234',
  doc.guid,
  doc,
  {
    connect: false,
  },
);

webSocket.connect();
webSocket.awareness.on('update', () => {
  const list: UserItem[] = [];
  for (const item of webSocket.awareness.getStates().entries()) {
    const [key, value] = item;
    if (!value.range || key === doc.clientID) {
      continue;
    }
    list.push({ clientId: key, range: value.range });
  }
  useUserInfo.getState().setUsers(list);
});

const workerInstance = wrap<WorkerMethod>(new Worker());
const controller = initController({
  worker: workerInstance,
  doc,
});

controller.on('rangeChange', (range) => {
  webSocket.awareness.setLocalStateField('range', range);
});

doc.on('update', (_a, _b, _c, tran) => {
  const changeSet = modelToChangeSet(tran);
  controller.emit('renderChange', { changeSet });
});

(window as any).controller = controller;
(window as any).doc = doc;
(window as any).version = version;

const provider = isCI ? undefined : new Provider();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ controller, provider }}>
      <Excel />
    </StateContext>
  </StrictMode>,
);
