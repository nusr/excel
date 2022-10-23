import { IScrollValue } from "@/types";
import type { Controller } from "./Controller";
export class Scroll implements IScrollValue {
  x = 0;
  y = 0;
  rowIndex = 0;
  colIndex = 0;
  controller: Controller;
  constructor(controller: Controller) {
    this.controller = controller;
  }
}
