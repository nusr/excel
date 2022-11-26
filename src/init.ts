import { StoreValue, IController, ChangeEventType } from './types';
import { Controller, Scroll, History } from './controller';
import { Model, MOCK_MODEL } from './model';
import { MainCanvas, RenderController } from './canvas';
import {
  DOUBLE_CLICK_TIME,
  FONT_FAMILY_LIST,
  isSupportFontFamily,
  MAIN_CANVAS_ID,
} from './util';
import theme from './theme';

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

function handleModelChange(
  stateValue: StoreValue,
  controller: IController,
  mainCanvas: MainCanvas,
  changeSet: Set<ChangeEventType>,
  renderController: RenderController,
) {
  const cell = controller.getCell(controller.getActiveCell());

  const canvasSize = renderController.getCanvasSize();
  const cellPosition = renderController.queryCell(cell.row, cell.col);
  cellPosition.top = canvasSize.top + cellPosition.top;

  const newStateValue: Partial<StoreValue> = {
    editCellValue: '',
    isCellEditing: false,
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
    sheetList: controller.getSheetList(),
    currentSheetId: controller.getCurrentSheetId(),
    cellPosition: cellPosition,
  };
  newStateValue.activeCell = cell;
  if (newStateValue.isCellEditing) {
    newStateValue.editCellValue = cell.formula || String(cell.value || '');
  }
  mainCanvas.checkChange({ changeSet: changeSet });
  Object.assign(stateValue, newStateValue);
}

function addEvents(
  stateValue: StoreValue,
  controller: IController,
  canvas: HTMLCanvasElement,
  renderController: RenderController,
): void {
  let lastTimeStamp = 0;

  window.addEventListener('resize', () => {
    controller.windowResize();
  });

  canvas.addEventListener('mousedown', (event) => {
    stateValue.contextMenuPosition = undefined;
    const canvasRect = canvas.getBoundingClientRect();
    const { timeStamp, clientX, clientY } = event;
    const { width, height } = renderController.getHeaderSize();
    const x = clientX - canvasRect.left;
    const y = clientY - canvasRect.top;
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
    const activeCell = controller.getActiveCell();
    const check =
      activeCell.row >= 0 &&
      activeCell.row === position.row &&
      activeCell.col === position.col;
    if (!check) {
      stateValue.isCellEditing = false;
      controller.setActiveCell(position.row, position.col, 1, 1);
    }
    const delay = timeStamp - lastTimeStamp;
    if (delay < DOUBLE_CLICK_TIME) {
      // controller.enterEditing();
      stateValue.isCellEditing = true;
    }
    lastTimeStamp = timeStamp;
  });
  canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const { clientX, clientY } = event;
    const { width, height } = renderController.getHeaderSize();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const checkMove = x > width && y > height && event.buttons === 1;
    if (checkMove) {
      const position = renderController.getHitInfo(event);
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
  const renderController = new RenderController(canvas);
  const mainCanvas = new MainCanvas(controller, renderController, canvas);
  addEvents(stateValue, controller, canvas, renderController);
  controller.setHooks({
    modelChange: (changeSet) => {
      handleModelChange(
        stateValue,
        controller,
        mainCanvas,
        changeSet,
        renderController,
      );
    },
  });
  controller.fromJSON(MOCK_MODEL);
}
export function initController(): IController {
  const controller = new Controller(new Model(), new Scroll(), new History());
  controller.addSheet();
  return controller;
}
