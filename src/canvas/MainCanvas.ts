import {
  EventType,
  MainView,
  IController,
  RequestInit,
  ResponseRender,
  RequestRender,
  IWindowSize,
} from '../types';
import { canvasSizeSet, dpr, getTheme, headerSizeSet } from '../util';
import * as ComLink from 'comlink';

export class MainCanvas implements MainView {
  private controller: IController;
  private canvas: HTMLCanvasElement;
  constructor(controller: IController, canvas: HTMLCanvasElement) {
    this.controller = controller;
    this.canvas = canvas;
    const offscreen = canvas?.transferControlToOffscreen?.();
    const worker = this.controller.getHooks().worker;
    if (offscreen) {
      const data: RequestInit = {
        canvas: offscreen,
        dpr: dpr(),
      };
      worker.init(ComLink.transfer(data, [data.canvas]));
    }
  }
  private renderCallback = (result: ResponseRender) => {
    const { rowMap, colMap } = result;
    const rowKeys = Object.keys(rowMap);
    const colKeys = Object.keys(colMap);
    if (colKeys.length === 0 && rowKeys.length === 0) {
      return;
    }
    this.controller.transaction(() => {
      for (const [row, h] of Object.entries(rowMap)) {
        const r = parseInt(row, 10);

        this.controller.setRowHeight(r, h);
      }
      for (const [col, w] of Object.entries(colMap)) {
        const c = parseInt(col, 10);

        this.controller.setColWidth(c, w);
      }
    });
  };
  async render(data: EventType) {
    const { controller } = this;
    const currentId = controller.getCurrentSheetId();
    const sheetInfo = controller.getSheetInfo(currentId);
    if (!sheetInfo) {
      return;
    }
    const copyRange = controller.getCopyRange();
    const jsonData = controller.toJSON();
    const eventData: RequestRender = {
      changeSet: data.changeSet,
      theme: getTheme(),
      canvasSize: canvasSizeSet.get(),
      headerSize: headerSizeSet.get(),
      currentSheetInfo: sheetInfo,
      scroll: controller.getScroll(currentId),
      range: controller.getActiveRange().range,
      copyRange,
      currentMergeCells: controller.getMergeCellList(currentId),
      customHeight: jsonData.customHeight,
      customWidth: jsonData.customWidth,
      sheetData: jsonData.worksheets,
      autoFilter: jsonData.autoFilter[currentId],
    };

    this.controller
      .getHooks()
      .worker.render(eventData, ComLink.proxy(this.renderCallback));
  }
  resize() {
    const { canvas } = this;
    const { width, height } = canvasSizeSet.get();
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    const eventData: IWindowSize = {
      width,
      height,
    };
    this.controller.getHooks().worker.resize(eventData);
  }
}
