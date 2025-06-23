import method from '../../canvas/worker';
import { Doc } from 'yjs';
import type { Remote } from 'comlink';
import type { IHooks, WorkerMethod } from '../../types';
export function getMockHooks() {
  const mockTestHooks: Pick<IHooks, 'doc' | 'worker'> = {
    worker: method as unknown as Remote<WorkerMethod>,
    doc: new Doc(),
  };
  return mockTestHooks;
}
