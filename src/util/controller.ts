import { IController } from "@/controller";
let controller: IController;
export function setController(c: IController): void {
  controller = c;
}
export function getController(): IController {
  return controller;
}
