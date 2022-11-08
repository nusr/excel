import { h } from '@/react';
import { SmartComponent } from '@/types';
const inputId = 'formula-editor';

export const FormulaEditor: SmartComponent = (state, controller) => {
  const { activeCell, isCellEditing, editCellValue } = state;
  const initValue =
    (activeCell.formula ? `=${activeCell.formula}` : '') ||
    String(activeCell.value || '');

  return h('input', {
    className: 'base-editor',
    id: inputId,
    value: isCellEditing ? editCellValue : initValue,
    onfocus: () => {
      controller.enterEditing();
    },
    onblur: (event: any) => {
      controller.setCellValue(activeCell, event.target.value);
      const dom = document.querySelector<HTMLInputElement>('#' + inputId)!;
      if (event.target === dom) {
        dom.value = '';
        controller.setActiveCell(activeCell.row + 1, activeCell.col, 1, 1);
      }
      controller.quitEditing();
      state.editCellValue = '';
    },
    onkeydown: (event: any) => {
      if (event.key === 'Enter') {
        const dom = document.querySelector<HTMLInputElement>('#' + inputId)!;
        dom.blur();
      } else {
        state.editCellValue = event.target.value;
      }
    },
  });
};

FormulaEditor.displayName = 'FormulaEditor';
