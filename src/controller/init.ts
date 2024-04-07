import { Model } from '@/model';
import { IController } from '@/types';
import { Controller } from './Controller';
import { copyOrCut, paste, HTML_FORMAT, PLAIN_FORMAT } from '@/util';

// just for init
export function initController(): IController {
  const model = new Model();
  const controller = new Controller(model, { copyOrCut, paste });
  controller.batchUpdate(() => {
    controller.addSheet();
  }, true);
  (window as any).controller = controller;
  return controller;
}

// just for test
export function initControllerForTest(isNoHistory = false) {
  const model = new Model();
  const controller = new Controller(model, {
    async copyOrCut() {
      return '';
    },
    async paste() {
      return {
        [HTML_FORMAT]: '',
        [PLAIN_FORMAT]: '',
      };
    },
  });
  controller.batchUpdate(() => {
    controller.addSheet();
  }, isNoHistory);
  return controller;
}
