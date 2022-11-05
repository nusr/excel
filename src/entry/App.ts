import { h, Component, useEffect } from '@/react';
// import { Lazy } from '@/components';
// import { useDispatch, useController } from '@/store';
// import { MOCK_MODEL } from '@/model';
// import { State } from '@/types';
import theme from '../theme';

import {
  CanvasContainer,
  SheetBarContainer,
  ToolbarContainer,
  FormulaBarContainer,
} from '@/containers';

export const App: Component = () => {
  // const controller = useController();
  // const dispatch = useDispatch();
  useEffect(() => {
    console.log('useEffect')
    for (const key of Object.keys(theme)) {
      document.documentElement.style.setProperty(
        `--${key}`,
        // @ts-ignore
        String(theme[key] || ''),
      );
    }
  }, []);
  // useEffect(() => {
  // controller.on('change', (data) => {
  // const { changeSet } = data;
  // const state: Partial<State> = {
  // canRedo: controller.canRedo(),
  // canUndo: controller.canUndo(),
  // };
  // if (changeSet.has('contentChange')) {
  // const { workbook, currentSheetId } = controller.model;
  // state.sheetList = workbook;
  // state.currentSheetId = currentSheetId;
  // }
  // const cell = controller.queryCell(controller.queryActiveCell());
  // const { isCellEditing, renderController } = controller;
  // if (renderController) {
  // const config = renderController.queryCell(cell.row, cell.col);
  // state.activeCell = { ...cell, ...config };
  // }
  // state.isCellEditing = isCellEditing;
  // if (isCellEditing) {
  // const editCellValue =
  // (cell.formula ? `=${cell.formula}` : '') || String(cell.value || '');
  // state.editCellValue = editCellValue;
  // } else {
  // state.editCellValue = '';
  // }
  // dispatch({ type: 'BATCH', payload: state });
  // });
  // controller.loadJSON(MOCK_MODEL);
  // }, [dispatch, controller]);
  return h(
    'div',
    {
      className: 'app-container',
      id: 'AppContainer',
    },
    h(ToolbarContainer, {}),
    h(FormulaBarContainer, {}),
    h(CanvasContainer, {}),
    h(SheetBarContainer, {}),
  );
};
App.displayName = 'App';
