import { StoreValue, IController, ChangeEventType } from './types';
import { Controller, Scroll, History } from './controller';
import { Model, MOCK_MODEL } from './Model';
import { MainCanvas, RenderController } from './canvas';
import { FONT_FAMILY_LIST, isSupportFontFamily, MAIN_CANVAS_ID } from './util';

import theme from '@/theme';

function initTheme() {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    document.documentElement.style.setProperty(
      `--${key}`,
      String(theme[key] || ''),
    );
  }
}
function initFontFamilyList() {
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
) {
  const cell = controller.queryCell(controller.getActiveCell());
  const newStateValue: Partial<StoreValue> = {
    editCellValue: '',
    isCellEditing: controller.getCellEditing(),
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
    sheetList: controller.getSheetList(),
    currentSheetId: controller.getCurrentSheetId(),
    cellPosition: mainCanvas.queryCell(cell.row, cell.col),
  };
  newStateValue.activeCell = cell;
  if (newStateValue.isCellEditing) {
    newStateValue.editCellValue =
      (cell.formula ? `=${cell.formula}` : '') || String(cell.value || '');
  }
  mainCanvas.checkChange({ changeSet: changeSet });
  Object.assign(stateValue, newStateValue);
}

export function initCanvas(stateValue: StoreValue, controller: IController) {
  initTheme();

  const canvas = document.querySelector<HTMLCanvasElement>(
    '#' + MAIN_CANVAS_ID,
  )!;
  const mainCanvas = new MainCanvas(
    controller,
    new RenderController(canvas),
    canvas,
  );
  mainCanvas.addEvents();
  controller.setHooks({
    focus: () => {
      canvas.focus();
    },
    blur: () => {
      // console.log('blur');
    },
    modelChange: (changeSet) => {
      console.log(changeSet);
      handleModelChange(stateValue, controller, mainCanvas, changeSet);
    },
  });
  controller.fromJSON(MOCK_MODEL);
  stateValue.fontFamilyList = initFontFamilyList();
}
export function initController(): IController {
  const controller = new Controller(new Model(), new Scroll(), new History());
  controller.addSheet();
  return controller;
}
