import { Controller } from "@/controller";
import { DOUBLE_CLICK_TIME, interactionLog } from "@/util";
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
    // interactionLog(event);
    const { timeStamp, clientX, clientY } = event;
    const { controller } = this;
    const { renderController } = controller;
    if (!renderController) {
      return;
    }
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
    const activeCell = controller.queryActiveCell();
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      controller.quitEditing();
      controller.setActiveCell(position.row, position.col);
    }
    const delay = timeStamp - this.lastTimeStamp;
    // const checkDelay = delay < DOUBLE_CLICK_TIME;
    if (delay < DOUBLE_CLICK_TIME) {
      // interactionLog("mouseDown", check, checkDelay);
      controller.enterEditing();
    }
    this.lastTimeStamp = timeStamp;
  };
  mouseMove = (event: MouseEvent): void => {
    const { clientX, clientY } = event;
    const { controller } = this;
    const { renderController } = controller;
    if (!renderController) {
      return;
    }
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
