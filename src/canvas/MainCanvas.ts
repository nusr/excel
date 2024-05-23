import { EventType, MainView, IController, RequestMessageType } from '@/types';
import { workerSet, canvasSizeSet, dpr, getTheme, headerSizeSet } from '@/util';

export class MainCanvas implements MainView {
  private controller: IController;
  private canvas: HTMLCanvasElement;
  constructor(controller: IController, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    let offscreen: OffscreenCanvas | undefined = undefined;
    if (canvas && typeof canvas.transferControlToOffscreen === 'function') {
      offscreen = canvas.transferControlToOffscreen();
    }
    const worker = workerSet.get().worker;
    if (worker && offscreen) {
      const data: RequestMessageType = {
        status: 'init',
        canvas: offscreen,
        dpr: dpr(),
      };
      worker.postMessage(data, [offscreen]);
    }
  }
  render(data: EventType) {
    const worker = workerSet.get().worker;
    if (!worker) {
      return;
    }
    const { controller } = this;
    const currentId = controller.getCurrentSheetId();
    const sheetInfo = controller.getSheetInfo(currentId);
    if (!sheetInfo) {
      return;
    }
    const jsonData = controller.toJSON();
    const eventData: RequestMessageType = {
      status: 'render',
      changeSet: data.changeSet,
      theme: getTheme(),
      canvasSize: canvasSizeSet.get(),
      headerSize: headerSizeSet.get(),
      currentSheetInfo: sheetInfo,
      scroll: controller.getScroll(currentId),
      range: controller.getActiveRange().range,
      copyRange: controller.getCopyRange(),
      currentMergeCells: controller.getMergeCellList(currentId),
      customHeight: jsonData.customHeight,
      customWidth: jsonData.customWidth,
      sheetData: jsonData.worksheets[currentId] || {},
    };
    worker.postMessage(eventData);
  }
  resize() {
    const worker = workerSet.get().worker;
    if (!worker) {
      return;
    }
    const { canvas } = this;
    const { width, height } = canvasSizeSet.get();
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const eventData: RequestMessageType = {
      status: 'resize',
      width,
      height,
    };
    worker.postMessage(eventData);
  }
}
