import { Model } from '@/model';
import { IController } from '@/types';
import { Controller } from './Controller';
import { copyOrCut, paste } from '@/util';

export function initController(): IController {
  const model = new Model();
  const controller = new Controller(model, { copyOrCut, paste });
  controller.addSheet();
  (window as any).controller = controller;
  (window as any).model = model;
  return controller;
}
