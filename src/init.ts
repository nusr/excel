import { StoreValue, IController } from './types';
import { Controller, History } from './controller';
import { Model, MOCK_MODEL } from './model';
import { MainCanvas, registerEvents } from './canvas';
import {
  COL_TITLE_WIDTH,
  FONT_FAMILY_LIST,
  isSupportFontFamily,
  MAIN_CANVAS_ID,
  ROW_TITLE_HEIGHT,
} from './util';
import theme from './theme';
import { resizeCanvas } from '@/util';

export function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ''));
  }
}
export function initFontFamilyList() {
  const list = FONT_FAMILY_LIST.map((v) => {
    const disabled = !isSupportFontFamily(v);
    return { label: v, value: v, disabled };
  });
  return list;
}

function getStoreValue(controller: IController, canvasTop: number) {
  const cell = controller.getCell(controller.getActiveCell());
  const cellPosition = controller.computeCellPosition(cell.row, cell.col);
  cellPosition.top = canvasTop + cellPosition.top;

  const newStateValue: Partial<StoreValue> = {
    isCellEditing: false,
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
    sheetList: controller.getSheetList(),
    currentSheetId: controller.getCurrentSheetId(),
    cellPosition: cellPosition,
    scroll: controller.getScroll(),
  };
  newStateValue.activeCell = cell;
  return newStateValue;
}

export function initCanvas(stateValue: StoreValue, controller: IController) {
  const canvas = document.querySelector<HTMLCanvasElement>(
    `#${MAIN_CANVAS_ID}`,
  )!;
  const ctx = canvas.getContext('2d')!;
  const mainCanvas = new MainCanvas(controller, ctx);
  registerEvents(stateValue, controller, canvas);
  controller.setHooks({
    getCanvasSize() {
      const size = canvas.getBoundingClientRect();
      return {
        top: size.top,
        left: size.left,
        width: size.width,
        height: size.height,
        contentWidth: size.width - COL_TITLE_WIDTH,
        contentHeight: size.height - ROW_TITLE_HEIGHT,
      };
    },
    modelChange: (changeSet) => {
      const canvasPosition = canvas.parentElement?.getBoundingClientRect();
      const canvasSize = {
        width: canvasPosition?.width || 0,
        height: canvasPosition?.height || 0,
      };
      const newStateValue = getStoreValue(controller, canvasPosition?.top || 0);
      Object.assign(stateValue, newStateValue);
      resizeCanvas(canvas, canvasSize.width, canvasSize.height);
      mainCanvas.render({ changeSet: changeSet, canvasSize });
      mainCanvas.render({
        changeSet: controller.getChangeSet(),
        canvasSize,
      });
    },
  });
  controller.fromJSON(MOCK_MODEL);
}
export function initController(): IController {
  const controller = new Controller(new Model(), new History());
  controller.addSheet();
  return controller;
}
