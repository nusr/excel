import { StoreValue, IController, ChangeEventType } from '@/types';
import { CELL_HEIGHT, CELL_WIDTH } from '@/util';
import { Model, MOCK_MODEL } from '@/model';
import { Controller, Scroll, History } from '@/controller';
import { MAIN_CANVAS_ID } from '@/util';
import { MainCanvas, RenderController } from '@/canvas';
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

function handleModelChange(
  controller: IController,
  mainCanvas: MainCanvas,
  changeSet: Set<ChangeEventType>,
) {
  const cell = controller.queryCell(controller.getActiveCell());
  const value: Partial<StoreValue> = {
    editCellValue: '',
    isCellEditing: controller.getCellEditing(),
    canRedo: controller.canRedo(),
    canUndo: controller.canUndo(),
    sheetList: controller.getSheetList(),
    currentSheetId: controller.getCurrentSheetId(),
    cellPosition: mainCanvas.queryCell(cell.row, cell.col),
  };
  value.activeCell = cell;
  if (value.isCellEditing) {
    value.editCellValue =
      (cell.formula ? `=${cell.formula}` : '') || String(cell.value || '');
  }
  globalStore.set(value);
  mainCanvas.checkChange({ changeSet: changeSet });
}

class Store {
  value: StoreValue;
  controller: IController;
  constructor() {
    this.value = {
      sheetList: [],
      currentSheetId: '',
      isCellEditing: false,
      editCellValue: '',
      activeCell: {
        value: '',
        row: 0,
        col: 0,
        style: {},
      },
      cellPosition: {
        left: -999,
        top: -999,
        width: CELL_WIDTH,
        height: CELL_HEIGHT,
      },
      canRedo: false,
      canUndo: false,
      fontFamilyList: [],
    };
    const controller = new Controller(new Model(), new Scroll(), new History());
    controller.addSheet();
    this.controller = controller;
  }

  initCanvas() {
    initTheme();
    const canvas = document.querySelector<HTMLCanvasElement>(
      '#' + MAIN_CANVAS_ID,
    )!;
    const mainCanvas = new MainCanvas(
      this.controller,
      new RenderController(canvas),
      canvas,
    );
    mainCanvas.addEvents();
    this.controller.setHooks({
      focus: () => {
        canvas.focus();
      },
      blur: () => {
        // console.log('blur');
      },
      modelChange: (changeSet) => {
        console.log(changeSet);
        handleModelChange(this.controller, mainCanvas, changeSet);
      },
    });
    this.controller.fromJSON(MOCK_MODEL);
  }
  get<T extends keyof StoreValue>(key: T): StoreValue[T] {
    return this.value[key];
  }
  set(newValue: Partial<StoreValue>) {
    this.value = Object.assign(this.value, newValue);
  }
}

const globalStore = new Store();
export default globalStore;
