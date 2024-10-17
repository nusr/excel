import { Model } from '@/model';
import { IController, IHooks, RemoteWorkerMethod } from '@/types';
import { Controller } from './Controller';
import { HTML_FORMAT, PLAIN_FORMAT, CUSTOM_FORMAT, IMAGE_FORMAT, isTestEnv } from '@/util';
import method from '@/canvas/worker';

export const mockTestHooks: IHooks = {
  async copyOrCut() { },
  async paste() {
    return {
      [HTML_FORMAT]: '',
      [PLAIN_FORMAT]: '',
      [CUSTOM_FORMAT]: null,
      [IMAGE_FORMAT]: null
    };
  },
  worker: method as unknown as RemoteWorkerMethod
}

export function initController(
  isNoHistory = false,
  hooks: IHooks = mockTestHooks
): IController {
  if (!isTestEnv() && hooks === mockTestHooks) {
    throw new Error('hooks must be provided in production or development environment');
  }
  const model = new Model(hooks.worker);
  const controller = new Controller(model, hooks);
  controller.batchUpdate(() => {
    controller.addSheet();
    return true;
  }, isNoHistory);
  return controller;
}
