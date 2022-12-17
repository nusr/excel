import { StoreValue, IController, ChangeEventType } from './types';
import { Controller, Scroll, History } from './controller';
import { Model, MOCK_MODEL } from './model';
import { MainCanvas } from './canvas';
import {
  DOUBLE_CLICK_TIME,
  FONT_FAMILY_LIST,
  isSupportFontFamily,
  MAIN_CANVAS_ID,
  FORMULA_EDITOR_ID,
} from './util';
import theme from './theme';
import { COL_TITLE_WIDTH, ROW_TITLE_HEIGHT, resizeCanvas } from '@/util';

interface IHitInfo {
  width: number;
  height: number;
  x: number;
  y: number;
  row: number;
  col: number;
  pageX: number;
  pageY: number;
}

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
  };
  newStateValue.activeCell = cell;
  return newStateValue;
}

function getHitInfo(
  event: MouseEvent,
  canvas: HTMLCanvasElement,
  controller: IController,
): IHitInfo {
  const { pageX, pageY } = event;
  const size = canvas.getBoundingClientRect();
  const x = pageX - size.left;
  const y = pageY - size.top;
  let resultX = COL_TITLE_WIDTH;
  let resultY = ROW_TITLE_HEIGHT;
  let row = 0;
  let col = 0;
  while (resultX + controller.getColWidth(col) <= x) {
    resultX += controller.getColWidth(col);
    col++;
  }
  while (resultY + controller.getRowHeight(row) <= y) {
    resultY += controller.getRowHeight(row);
    row++;
  }
  const cellSize = controller.getCellSize(row, col);
  return { ...cellSize, row, col, pageY, pageX, x, y };
}

function addEvents(
  stateValue: StoreValue,
  controller: IController,
  canvas: HTMLCanvasElement,
): void {
  let lastTimeStamp = 0;
  const inputDom = document.querySelector<HTMLInputElement>(
    `#${FORMULA_EDITOR_ID}`,
  )!;
  window.addEventListener('resize', () => {
    controller.windowResize();
  });
  window.addEventListener('keydown', () => {
    stateValue.isCellEditing = true;
    inputDom.focus();
  });

  canvas.addEventListener('mousedown', (event) => {
    stateValue.contextMenuPosition = undefined;
    const canvasRect = canvas.getBoundingClientRect();
    const { timeStamp, clientX, clientY } = event;
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
    const position = getHitInfo(event, canvas, controller);
    if (COL_TITLE_WIDTH > x && ROW_TITLE_HEIGHT > y) {
      controller.selectAll(position.row, position.col);
      return;
    }
    if (COL_TITLE_WIDTH > x && ROW_TITLE_HEIGHT <= y) {
      controller.selectRow(position.row, position.col);
      return;
    }
    if (COL_TITLE_WIDTH <= x && ROW_TITLE_HEIGHT > y) {
      controller.selectCol(position.row, position.col);
      return;
    }
    const activeCell = controller.getActiveCell();
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      // stateValue.isCellEditing = false;
      controller.setActiveCell(position.row, position.col, 1, 1);
    }
    const delay = timeStamp - lastTimeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      stateValue.isCellEditing = true;
    }
    lastTimeStamp = timeStamp;
  });

  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const checkMove =
      x > COL_TITLE_WIDTH && y > ROW_TITLE_HEIGHT && event.buttons === 1;
    if (checkMove) {
      const position = getHitInfo(event, canvas, controller);
      controller.updateSelection(position.row, position.col);
    }
  });
  canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    console.log(event);
    stateValue.contextMenuPosition = {
      top: event.clientY,
      left: event.clientX,
      width: 100,
      height: 100,
    };
    return false;
  });
}

export function initCanvas(stateValue: StoreValue, controller: IController) {
  const canvas = document.querySelector<HTMLCanvasElement>(
    `#${MAIN_CANVAS_ID}`,
  )!;
  const ctx = canvas.getContext('2d')!;
  const mainCanvas = new MainCanvas(controller, ctx);
  addEvents(stateValue, controller, canvas);
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
      mainCanvas.render({ changeSet: changeSet, canvasSize });
      if (controller.isChanged) {
        controller.isChanged = false;
        mainCanvas.render({
          changeSet: new Set<ChangeEventType>(['contentChange']),
          canvasSize,
        });
      }
    },
  });
  controller.fromJSON(MOCK_MODEL);
}
export function initController(): IController {
  const controller = new Controller(new Model(), new Scroll(), new History());
  controller.addSheet();
  return controller;
}
