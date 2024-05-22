import { Model } from '@/model';
import { IController, IHooks } from '@/types';
import { Controller } from './Controller';
import { HTML_FORMAT, PLAIN_FORMAT, workerSet } from '@/util';

export function initController(
  isNoHistory = false,
  hooks: IHooks = {
    async copyOrCut() {
      return '';
    },
    async paste() {
      return {
        [HTML_FORMAT]: '',
        [PLAIN_FORMAT]: '',
      };
    },
  },
  worker?: Worker,
): IController {
  if (worker) {
    workerSet.set({ worker });
  }
  const model = new Model();
  const controller = new Controller(model, hooks);
  controller.batchUpdate(() => {
    controller.addSheet();
    return true;
  }, isNoHistory);
  return controller;
}
