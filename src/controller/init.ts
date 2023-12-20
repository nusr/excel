import { Model } from '@/model';
import { IController } from '@/types';
import { Controller } from './Controller';

export function initController(): IController {
  const model = new Model();
  const controller = new Controller(model);
  controller.addSheet();
  (window as any).controller = controller;
  (window as any).model = model;
  return controller;
}
