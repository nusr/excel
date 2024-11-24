import { App } from './containers';
import { initController } from './controller';
import './global.css';
import { StateContext, useExcel } from './containers';
import { initCollaboration } from './collaboration';
import * as Y from 'yjs';
import workerMethod from './canvas/worker';
import { Loading } from './components';

export * from 'comlink';

export function initDoc(...params: ConstructorParameters<typeof Y.Doc>) {
  return new Y.Doc(...params);
}

export {
  initCollaboration,
  StateContext,
  useExcel,
  initController,
  App,
  workerMethod,
  Loading,
};
