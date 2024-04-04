import { Model } from '@/model';
import { IController } from '@/types';
import { Controller } from './Controller';
import { copyOrCut, paste, isTestEnv } from '@/util';

export function initController(isNoHistory = false): IController {
  const model = new Model();
  const controller = new Controller(model, { copyOrCut, paste });
  controller.batchUpdate(() => {
    controller.addSheet();
  }, isNoHistory);
  if (!isTestEnv()) {
    (window as any).controller = controller;
  }
  return controller;
}
