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
} from '../src';
import Worker from './worker?worker';
import './sentry';
import { WebsocketProvider } from 'y-websocket';

const docId =
  import.meta.env.VITE_DEFAULT_EXCEL_ID ||
  '184858c4-be37-41b5-af82-52689004e605';
const doc = initDoc({ guid: docId });
location.hash = `#${docId}`;

const provider = new WebsocketProvider('ws://localhost:1234', doc.guid, doc, {
  connect: false,
});

provider.connect();
provider.awareness.on('update', () => {
  const list: UserItem[] = [];
  for (const item of provider.awareness.getStates().entries()) {
    const [key, value] = item;
    if (!value.range || key === doc.clientID) {
      continue;
    }
    list.push({ clientId: key, range: value.range });
  }
  console.log(list)
  useUserInfo.getState().setUsers(list);
});

const workerInstance = wrap<WorkerMethod>(new Worker());
const controller = initController({
  worker: workerInstance,
  doc,
});

controller.on('rangeChange', (range) => {
  provider.awareness.setLocalStateField('range', range);
});

doc.on('update', () => {
  controller.emit('renderChange', { changeSet: new Set(['rangeMap']) });
});

(window as any).controller = controller;
(window as any).doc = doc;
(window as any).version = version;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <StateContext value={{ controller }}>
      <Excel />
    </StateContext>
  </StrictMode>,
);
