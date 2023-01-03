import { StoreValue, IController, ChangeEventType } from "./types";
import { Controller, History } from "./controller";
import { Model, MOCK_MODEL } from "./model";
import { MainCanvas, registerEvents, Selection, Content } from "./canvas";
import {
  FONT_FAMILY_LIST,
  isSupportFontFamily,
  MAIN_CANVAS_ID,
  createCanvas,
} from "./util";
import theme from "./theme";

export function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ""));
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
  const scroll = controller.getScroll();
  const newStateValue: Partial<StoreValue> = {
    isCellEditing: false,
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
    sheetList: controller.getSheetList(),
    currentSheetId: controller.getCurrentSheetId(),
    cellPosition: cellPosition,
    scrollLeft: scroll.scrollLeft,
    scrollTop: scroll.scrollTop,
  };
  newStateValue.activeCell = cell;
  return newStateValue;
}

export function initCanvas(stateValue: StoreValue, controller: IController) {
  const canvas = document.querySelector<HTMLCanvasElement>(
    `#${MAIN_CANVAS_ID}`
  )!;
  const mainCanvas = new MainCanvas(canvas, new Content(controller, createCanvas()), new Selection(controller, createCanvas()));
  const resize = () => {
    const size = canvas.parentElement!.getBoundingClientRect();
    mainCanvas.resize(size.width, size.height);
    mainCanvas.render({
      changeSet: new Set<ChangeEventType>(["contentChange"]),
    });
  };
  resize();
  registerEvents(stateValue, controller, canvas, resize);
  const canvasPosition = canvas.parentElement!.getBoundingClientRect();
  controller.setHooks({
    modelChange: (changeSet) => {
      const newStateValue = getStoreValue(controller, canvasPosition.top);
      Object.assign(stateValue, newStateValue);
      mainCanvas.render({ changeSet: changeSet });
      mainCanvas.render({
        changeSet: controller.getChangeSet(),
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
