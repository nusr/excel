import { h, Component } from '@/react';
import globalStore from '@/store';
const inputId = 'formula-editor';

export const FormulaEditor: Component = (props, children, forceUpdate) => {
  const activeCell = globalStore.get('activeCell');
  const editCellValue = globalStore.get('editCellValue');
  const isCellEditing = globalStore.get('isCellEditing');
  const initValue =
    (activeCell.formula ? `=${activeCell.formula}` : '') ||
    String(activeCell.value || '');

  return h('input', {
    className: 'base-editor',
    id: inputId,
    value: isCellEditing ? editCellValue : initValue,
    onfocus: () => {
      globalStore.getController().enterEditing();
    },
    onblur: (event: any) => {
      const controller = globalStore.getController();
      const cell = globalStore.get('activeCell');
      controller.setCellValue(cell, event.target.value);
      const dom = document.querySelector<HTMLInputElement>('#' + inputId)!;
      if (event.target === dom) {
        dom.value = '';
        controller.setActiveCell(cell.row + 1, cell.col, 1, 1);
      }
      globalStore.getController().quitEditing();
      globalStore.set({ editCellValue: '' });
    },
    onkeydown: (event: any) => {
      if (event.key === 'Enter') {
        const dom = document.querySelector<HTMLInputElement>('#' + inputId)!;
        dom.blur();
      } else {
        globalStore.set({
          editCellValue: event.target.value,
        });
      }
    },
  });
};

FormulaEditor.displayName = 'FormulaEditor';
