import { Model } from '@/model';
import { IController, IHooks } from '@/types';
import { Controller } from './Controller';
import { HTML_FORMAT, PLAIN_FORMAT, CUSTOM_FORMAT, IMAGE_FORMAT } from '@/util';
import method from '@/canvas/worker';

const mockWorker: any = method;

export const mockHooks: IHooks = {
  async copyOrCut() {

  },
  async paste() {
    return {
      [HTML_FORMAT]: '',
      [PLAIN_FORMAT]: '',
      [CUSTOM_FORMAT]: '',
      [IMAGE_FORMAT]: null
    };
  },
  worker: mockWorker
}

export function initController(
  isNoHistory = false,
  hooks: IHooks = mockHooks
): IController {
  const model = new Model(hooks.worker);
  const controller = new Controller(model, hooks);
  controller.batchUpdate(() => {
    controller.addSheet();
    return true;
  }, isNoHistory);
  return controller;
}
