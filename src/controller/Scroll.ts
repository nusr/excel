import { IController, IScrollValue } from "@/types";

export class Scroll implements IScrollValue {
  x = 0;
  y = 0;
  rowIndex = 0;
  colIndex = 0;
  controller: IController;
  constructor(controller: IController) {
    this.controller = controller;
  }
}
