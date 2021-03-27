import { Controller } from "@/controller";
import { Controller as RenderController } from "@/canvas";

import { DOUBLE_CLICK_TIME, interactionLog } from "@/util";
export class Interaction {
  protected canvas: HTMLCanvasElement;
  protected controller: Controller;
  protected lastTimeStamp = 0;
  protected canvasRect: ClientRect;
  renderController: RenderController;
  constructor(
    controller: Controller,
    canvas: HTMLCanvasElement,
    renderController: RenderController
  ) {
    this.canvas = canvas;
    this.renderController = renderController;
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
    const { timeStamp, clientX, clientY } = event;
    const { controller, renderController } = this;
    const { width, height } = renderController.getHeaderSize();
    const x = clientX - this.canvasRect.left;
    const y = clientY - this.canvasRect.top;
    const position = renderController.getHitInfo(event);
    if (width > x && height > y) {
      controller.selectAll(position.row, position.col);
      return;
    }
    if (width > x && height <= y) {
      controller.selectRow(position.row, position.col);
      return;
    }
    if (width <= x && height > y) {
      controller.selectCol(position.row, position.col);
      return;
    }
    controller.setActiveCell(position.row, position.col);
    const delay = timeStamp - this.lastTimeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      controller.enterEditing();
    }
    this.lastTimeStamp = timeStamp;
    interactionLog("mouseDown", position);
  };
  mouseMove = (event: MouseEvent): void => {
    const { clientX, clientY } = event;
    const { controller, renderController } = this;
    const { width, height } = renderController.getHeaderSize();
    const x = clientX - this.canvasRect.left;
    const y = clientY - this.canvasRect.top;
    const checkMove = x > width && y > height && event.buttons === 1;
    if (checkMove) {
      const position = renderController.getHitInfo(event);
      interactionLog("mouseMove", position);
      controller.updateSelection(position.row, position.col);
    }
  };
  mouseUp = (): void => {
    // console.log(event);
  };
  resize = (): void => {
    this.controller.windowResize();
  };
}
