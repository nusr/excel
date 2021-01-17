import { Controller } from "@/controller";
import { DOUBLE_CLICK_TIME } from "@/util";
export class Interaction {
  protected canvas: HTMLCanvasElement;
  protected controller: Controller;
  protected lastTimeStamp = 0;
  protected canvasRect: ClientRect;
  constructor(controller: Controller, canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.canvasRect = this.canvas.getBoundingClientRect();
    this.controller = controller;
    this.addEvents();
  }
  addEvents(): void {
    const { canvas } = this;
    canvas.addEventListener("mousedown", this.mouseDown);
    canvas.addEventListener("mousemove", this.mouseMove);
    canvas.addEventListener("mouseup", this.mouseUp);
    window.addEventListener("resize", this.resize);
  }
  removeEvents(): void {
    const { canvas } = this;
    canvas.removeEventListener("mousedown", this.mouseDown);
    canvas.removeEventListener("mousemove", this.mouseMove);
    canvas.removeEventListener("mouseup", this.mouseUp);
    window.removeEventListener("resize", this.resize);
  }
  mouseDown = (event: MouseEvent): void => {
    console.log(event);
    const { timeStamp, offsetX, offsetY } = event;
    const { controller } = this;
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
    controller.setActiveCell(position.row, position.col);
    const delay = timeStamp - this.lastTimeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      controller.enterEditing();
    }
    this.lastTimeStamp = timeStamp;
    console.log("mousedown", position);
  };
  mouseMove = (event: MouseEvent): void => {
    const { offsetX, offsetY } = event;
    const { controller } = this;
    const {
      width,
      height,
    } = controller.model.getRowTitleHeightAndColTitleWidth();
    const checkMove =
      offsetX > width && offsetY > height && event.buttons === 1;
    if (checkMove) {
      const position = controller.clickPositionToCell(offsetX, offsetY);
      // console.log("mouseMove", position);
      controller.updateSelection(position.row, position.col);
    }
  };
  mouseUp = (event: MouseEvent): void => {
    // console.log(event);
  };
  resize = (): void => {
    this.controller.windowResize();
  };
}
