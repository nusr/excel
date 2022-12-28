import { StoreValue, IController, ChangeEventType } from './types';
import { Controller, History } from './controller';
import { Model, MOCK_MODEL } from './model';
import { MainCanvas, registerEvents, Selection, Content } from './canvas';
import {
  FONT_FAMILY_LIST,
  isSupportFontFamily,
  MAIN_CANVAS_ID,
  createCanvas,
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
  const content = new Content(controller, createCanvas());
  const selection = new Selection(controller, createCanvas());
  const mainCanvas = new MainCanvas(controller, canvas, content, selection);
  const resize = () => {
    const canvasPosition = canvas.parentElement!.getBoundingClientRect();
    mainCanvas.resize(canvasPosition.width, canvasPosition.height);
    mainCanvas.render({
      width: canvasPosition.width,
      height: canvasPosition.height,
      changeSet: new Set<ChangeEventType>(['contentChange']),
    });
  };
  resize();
  registerEvents(stateValue, controller, canvas, resize);
  controller.setHooks({
    modelChange: (changeSet) => {
      const canvasPosition = canvas.parentElement?.getBoundingClientRect();
      const canvasSize = {
        width: canvasPosition?.width || 0,
        height: canvasPosition?.height || 0,
      };
      const newStateValue = getStoreValue(controller, canvasPosition?.top || 0);
      Object.assign(stateValue, newStateValue);
      resizeCanvas(canvas, canvasSize.width, canvasSize.height);
      mainCanvas.render({ ...canvasSize, changeSet: changeSet });
      mainCanvas.render({
        ...canvasSize,
        changeSet: controller.getChangeSet(),
      });
    },
  });
  controller.fromJSON(MOCK_MODEL);
}
export function initController(): IController {
  const controller = new Controller(new Model(), new History());
  return controller;
}
