import method from '../../canvas/worker';
import * as Y from 'yjs';
import { Remote } from 'comlink'
import type { IHooks, WorkerMethod } from '@excel/shared';
export function getMockHooks() {
  const mockTestHooks: Pick<IHooks, 'doc' | 'worker'> = {
    worker: method as unknown as Remote<WorkerMethod>,
    doc: new Y.Doc(),
  };
  return mockTestHooks;
}
