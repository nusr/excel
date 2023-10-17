import { Model, History } from '@/model';
import { Controller } from './Controller';
export function initController() {
    const controller = new Controller(new Model(new History()));
    controller.addSheet();
    window.controller = controller;
    return controller;
}
//# sourceMappingURL=init.js.map