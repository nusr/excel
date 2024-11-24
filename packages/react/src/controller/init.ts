import { Model } from '../model';
import type { IController, IHooks, WorkerMethod } from '@excel/shared';
import { Controller } from './Controller';
import { HTML_FORMAT, PLAIN_FORMAT, CUSTOM_FORMAT, IMAGE_FORMAT } from '@excel/shared';
import method from '../canvas/worker';
import * as Y from 'yjs';
import { Remote } from 'comlink'

export function getMockHooks() {
  const mockTestHooks: IHooks = {
    async copyOrCut() {},
    async paste() {
      return {
        [HTML_FORMAT]: '',
        [PLAIN_FORMAT]: '',
        [CUSTOM_FORMAT]: null,
        [IMAGE_FORMAT]: null,
      };
    },
    worker: method as unknown as Remote<WorkerMethod>,
    doc: new Y.Doc(),
  };
  return mockTestHooks;
}

export function initController(hooks: IHooks = getMockHooks()): IController {
  const model = new Model(hooks);
  const controller = new Controller(model, hooks);
  return controller;
}
