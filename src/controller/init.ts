import { Model, History } from '@/model';
import { IController } from '@/types';
import { Controller } from './Controller';

export function initController(): IController {
  const controller = new Controller(new Model(new History()));
  controller.addSheet();
  (window as any).controller = controller;
  return controller;
}
