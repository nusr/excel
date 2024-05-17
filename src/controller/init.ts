import { Model } from '@/model';
import { IController, IHooks } from '@/types';
import { Controller } from './Controller';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

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
  workerPath = './worker.js',
): IController {
  const model = new Model(workerPath);
  const controller = new Controller(model, hooks);
  controller.batchUpdate(() => {
    controller.addSheet();
  }, isNoHistory);
  return controller;
}
