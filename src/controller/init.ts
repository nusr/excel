import { Model } from '../model';
import type { IController } from '../types';
import { Controller } from './Controller';
import method from '../canvas/worker';
import { Doc } from 'yjs';
import { wrap } from 'comlink';

function getMockHooks() {
  return {
    worker: method as any,
    doc: new Doc(),
  };
}

export function initController(
  options: {
    worker: Worker;
    doc: Doc;
  } = getMockHooks(),
): IController {
  const worker =
    options.worker instanceof Worker
      ? wrap(options.worker)
      : (options.worker as any);

  const hooks = {
    worker,
    doc: options.doc,
  };
  const model = new Model(hooks);
  const controller = new Controller(model, hooks);
  return controller;
}
