import { h, Component } from '@/react';
import globalStore from '@/store';
const inputId = 'formula-editor';

export const FormulaEditor: Component = () => {
  const activeCell = globalStore.value.activeCell;
  const editCellValue = globalStore.value.editCellValue;
  const isCellEditing = globalStore.value.isCellEditing;
  const initValue =
    (activeCell.formula ? `=${activeCell.formula}` : '') ||
    String(activeCell.value || '');

  return h('input', {
    className: 'base-editor',
    id: inputId,
    value: isCellEditing ? editCellValue : initValue,
    onfocus: () => {
      globalStore.controller.enterEditing();
    },
    onblur: (event: any) => {
      const controller = globalStore.controller;
      const cell = globalStore.value.activeCell;
      controller.setCellValue(cell, event.target.value);
      const dom = document.querySelector<HTMLInputElement>('#' + inputId)!;
      if (event.target === dom) {
        dom.value = '';
        controller.setActiveCell(cell.row + 1, cell.col, 1, 1);
      }
      globalStore.controller.quitEditing();
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
