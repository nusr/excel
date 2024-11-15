import { Model } from '@/model';
import { IController, IHooks, RemoteWorkerMethod } from '@/types';
import { Controller } from './Controller';
import { HTML_FORMAT, PLAIN_FORMAT, CUSTOM_FORMAT, IMAGE_FORMAT } from '@/util';
import method from '@/canvas/worker';
import * as Y from 'yjs';

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
    worker: method as unknown as RemoteWorkerMethod,
    doc: new Y.Doc(),
  };
  return mockTestHooks;
}

export function initController(hooks: IHooks = getMockHooks()): IController {
  const model = new Model(hooks);
  const controller = new Controller(model, hooks);
  // const excludeSet = new Set<keyof IController>([
  //   'transaction',
  //   'undo',
  //   'redo',
  //   'canRedo',
  //   'canUndo',
  //   'emitChange',
  // ]);
  // const instance = new Proxy<IController>(controller, {
  //   get(target: IController, key: keyof IController) {
  //     if (typeof target[key] === 'function' && !excludeSet.has(key)) {
  //       return function (...args: Parameters<(typeof target)[typeof key]>) {
  //         return hooks.doc.transact(
  //           // @ts-ignore
  //           () => target[key].apply(target, args),
  //           SYNC_FLAG.MODEL,
  //         );
  //       };
  //     }
  //     return target[key];
  //   },
  // });
  return controller;
}
