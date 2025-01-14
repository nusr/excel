import {
  initController,
  type WorkerMethod,
  UserItem,
  useUserInfo,
  modelToChangeSet,
} from 'excel-collab';
import Worker from './worker?worker';
import { WebsocketProvider } from 'y-websocket';
import { wrap } from 'comlink';
import { Doc } from 'yjs';
import { getDocId } from './util';

export function initControllerState() {
  const docId = getDocId();
  location.hash = `#${docId}`;
  const doc = new Doc({ guid: docId });

  const webSocket = new WebsocketProvider(
    'ws://localhost:1234',
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

  const controller = initController({
    worker: wrap<WorkerMethod>(new Worker()),
    doc,
  });

  controller.on('rangeChange', (range) => {
    webSocket.awareness.setLocalStateField('range', range);
  });

  doc.on('update', (_a, _b, _c, tran) => {
    const changeSet = modelToChangeSet(tran);
    controller.emit('renderChange', { changeSet });
  });
  return controller;
}
