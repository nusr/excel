import { h, Component } from '@/react';
import theme from './theme';
import { Model, MOCK_MODEL } from '@/model';
import { Controller, Scroll } from '@/controller';
import { MAIN_CANVAS_ID } from '@/util';
import { MainCanvas, RenderController } from '@/canvas';
import globalStore from '@/store';
import {
  CanvasContainer,
  SheetBarContainer,
  ToolbarContainer,
  FormulaBarContainer,
} from '@/containers';
import { IController, ChangeEventType, StoreValue } from '@/types';

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

export const App: Component = () => {
  return h(
    'div',
    {
      className: 'app-container',
    },
    h(ToolbarContainer, {}),
    h(FormulaBarContainer, {}),
    h(CanvasContainer, {}),
    h(SheetBarContainer, {}),
  );
};
App.displayName = 'App';
App.onceMount = (forceUpdate) => {
  const keyList = Object.keys(theme) as Array<keyof typeof theme>;
  for (const key of keyList) {
    document.documentElement.style.setProperty(
      `--${key}`,
      String(theme[key] || ''),
    );
  }
  const canvas = document.querySelector<HTMLCanvasElement>(
    '#' + MAIN_CANVAS_ID,
  )!;
  const controller = new Controller(new Model(), new Scroll());
  globalStore.setController(controller);
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
      globalStore.setUpdate(forceUpdate);
      handleModelChange(controller, mainCanvas, changeSet);
    },
  });
  controller.fromJSON(MOCK_MODEL);
  return mainCanvas.removeEvents;
};
