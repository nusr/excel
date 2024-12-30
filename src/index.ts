import * as Y from 'yjs';
import './global.css';

export * from 'comlink';
export * from './components';
export * from './containers';
export { default as workerMethod } from './canvas/worker';
export { initController } from './controller';
export * from './util';
export * from './types';
export function initDoc(...params: ConstructorParameters<typeof Y.Doc>) {
  return new Y.Doc(...params);
}

export const version = process.env.VERSION;
