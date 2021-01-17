import { Controller } from "@/controller";
import { DOUBLE_CLICK_TIME } from "@/util";
export class Interaction {
  canvas: HTMLCanvasElement;
  controller: Controller;
  lastTimeStamp = 0;
  constructor(controller: Controller, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.controller = controller;
    this.addEvents();
  }
  addEvents(): void {
    const { canvas } = this;
    canvas.addEventListener("mousedown", this.mouseDown);
    window.addEventListener("resize", this.resize);
  }
  removeEvents(): void {
    const { canvas } = this;
    canvas.removeEventListener("mousedown", this.mouseDown);
    window.removeEventListener("resize", this.resize);
  }
  mouseDown = (event: MouseEvent): void => {
    // console.log("handleClick");
    // console.log(event);
    const { controller } = this;
    const { timeStamp, offsetX, offsetY } = event;
    const {
      width,
      height,
    } = controller.model.getRowTitleHeightAndColTitleWidth();
    if (offsetX < width && offsetY < height) {
      controller.selectAll();
      return;
    }
    if (offsetX < width) {
      controller.selectRow();
      return;
    }
    if (offsetY < height) {
      controller.selectCol();
      return;
    }
    const position = controller.clickPositionToCell(offsetX, offsetY);
    controller.updateSelection(position.row, position.col);
    const delay = timeStamp - this.lastTimeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      controller.enterEditing();
    }
    this.lastTimeStamp = timeStamp;
  };
  resize = (): void => {
    this.controller.windowResize();
  };
}
