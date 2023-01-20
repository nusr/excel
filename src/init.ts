import { StoreValue, IController, ChangeEventType, OptionItem } from './types';
import { Controller, History } from './controller';
import { Model, MOCK_MODEL } from './model';
import { MainCanvas, registerEvents, Content } from './canvas';
import {
  FONT_FAMILY_LIST,
  isSupportFontFamily,
  copy,
  cut,
  paste,
  theme,
} from './util';

export function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ''));
  }
}
export function initFontFamilyList(fontList = FONT_FAMILY_LIST) {
  const list = fontList.map((v) => {
    const disabled = !isSupportFontFamily(v);
    return { label: v, value: v, disabled };
  });
  return list;
}

function getStoreValue(controller: IController, fontFamilyList: OptionItem[]) {
  const { top } = controller.getDomRect();
  const { scrollLeft, scrollTop } = controller.getScroll();
  const cell = controller.getCell(controller.getActiveCell());
  const cellPosition = controller.computeCellPosition(cell.row, cell.col);
  cellPosition.top = top + cellPosition.top;
  if (!cell.style) {
    cell.style = {};
  }
  if (!cell.style.fontFamily) {
    let defaultFontFamily = '';
    for (const item of fontFamilyList) {
      if (!item.disabled) {
        defaultFontFamily = String(item.value);
        break;
      }
    }
    cell.style.fontFamily = defaultFontFamily;
  }
  const newStateValue: Partial<StoreValue> = {
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
    sheetList: controller.getSheetList(),
    currentSheetId: controller.getCurrentSheetId(),
    cellPosition: cellPosition,
    scrollLeft,
    scrollTop,
    headerSize: controller.getHeaderSize(),
    activeCell: cell,
  };
  return newStateValue;
}

function createCanvas() {
  const canvas = document.createElement('canvas');
  canvas.style.display = 'none';
  document.body.appendChild(canvas);
  return canvas;
}

export function initCanvas(stateValue: StoreValue, controller: IController) {
  const mainCanvas = new MainCanvas(
    controller,
    new Content(controller, createCanvas()),
  );
  const resize = () => {
    mainCanvas.resize();
    mainCanvas.render({
      changeSet: new Set<ChangeEventType>(['content']),
    });
  };
  resize();
  registerEvents(stateValue, controller, resize);
  controller.setHooks({
    copy,
    cut,
    paste,
    modelChange: (changeSet) => {
      const newStateValue = getStoreValue(
        controller,
        stateValue.fontFamilyList,
      );
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
