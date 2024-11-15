import method from '@/canvas/worker';
import * as Y from 'yjs';
import type { IHooks, RemoteWorkerMethod } from '@/types';
export function getMockHooks() {
  const mockTestHooks: Pick<IHooks, 'doc' | 'worker'> = {
    worker: method as unknown as RemoteWorkerMethod,
    doc: new Y.Doc(),
  };
  return mockTestHooks;
}
