import { Model } from '../model';
import type { IController, IHooks, WorkerMethod } from '../types';
import { Controller } from './Controller';
import method from '../canvas/worker';
import { Doc } from 'yjs';
import type { Remote } from 'comlink';

export function getMockHooks() {
  const mockTestHooks: IHooks = {
    worker: method as unknown as Remote<WorkerMethod>,
    doc: new Doc(),
  };
  return mockTestHooks;
}

export function initController(hooks: IHooks = getMockHooks()): IController {
  const model = new Model(hooks);
  const controller = new Controller(model, hooks);
  return controller;
}
