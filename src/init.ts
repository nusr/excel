import { StoreValue, IController, ChangeEventType, OptionItem } from './types';
import { Controller } from './controller';
import { Model, MOCK_MODEL, History } from './model';
import { MainCanvas, registerGlobalEvent, Content } from './canvas';
import {
  FONT_FAMILY_LIST,
  QUERY_ALL_LOCAL_FONT,
  isSupportFontFamily,
  copy,
  cut,
  paste,
  theme,
  LOCAL_FONT_KEY,
} from './util';

export function initTheme(dom: HTMLElement) {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    dom.style.setProperty(`--${key}`, String(theme[key] || ''));
  }
}
export function initFontFamilyList(fontList = FONT_FAMILY_LIST): OptionItem[] {
  const cacheFont = localStorage.getItem(LOCAL_FONT_KEY);
  if (cacheFont) {
    const fontList = JSON.parse(cacheFont) as string[];
    return fontList.map((v) => ({ value: v, label: v, disabled: false }));
  }
  const list = fontList.map((v) => ({
    label: v,
    value: v,
    disabled: !isSupportFontFamily(v),
  }));
  if ((window as any).queryLocalFonts) {
    list.push({
      value: QUERY_ALL_LOCAL_FONT,
      label: '--> query all local fonts',
      disabled: false,
    });
  }
  return list;
}

function getStoreValue(
  controller: IController,
  stateValue: StoreValue,
): Partial<StoreValue> {
  const { top } = controller.getDomRect();
  const activeCell = controller.getActiveCell();
  const cell = controller.getCell(activeCell);
  const cellPosition = controller.computeCellPosition(
    activeCell.row,
    activeCell.col,
  );
  cellPosition.top = top + cellPosition.top;
  if (!cell.style) {
    cell.style = {};
  }
  if (!cell.style.fontFamily) {
    let defaultFontFamily = '';
    for (const item of stateValue.fontFamilyList) {
      if (!item.disabled) {
        defaultFontFamily = String(item.value);
        break;
      }
    }
    cell.style.fontFamily = defaultFontFamily;
  }
  const sheetList = controller
    .getSheetList()
    .map((v) => ({ value: v.sheetId, label: v.name }));
  const newStateValue: Partial<StoreValue> = {
    activeCell: {
      ...cellPosition,
      ...cell,
    },
    sheetList,
    currentSheetId: controller.getCurrentSheetId(),
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
  const removeEvent = registerGlobalEvent(stateValue, controller, resize);
  controller.setHooks({
    copy,
    cut,
    paste,
    modelChange: (changeSet) => {
      const newStateValue = getStoreValue(controller, stateValue);
      Object.assign(stateValue, newStateValue);
      mainCanvas.render({ changeSet: changeSet });
      mainCanvas.render({
        changeSet: controller.getChangeSet(),
      });
    },
  });
  controller.fromJSON(MOCK_MODEL);
  return removeEvent;
}
export function initController(): IController {
  const controller = new Controller(new Model(new History()));
  controller.addSheet();
  (window as any).controller = controller;
  return controller;
}
