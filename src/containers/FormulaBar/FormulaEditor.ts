import { h, SmartComponent, CSSProperties } from '@/react';
import { QueryCellResult } from '@/types';
import { DEFAULT_FONT_COLOR, makeFont, DEFAULT_FONT_SIZE } from '@/util';
import { isEmpty } from '@/lodash';

export function getEditorStyle(
  style: QueryCellResult['style'],
): CSSProperties | undefined {
  if (isEmpty(style)) {
    return undefined;
  }
  const font = makeFont(
    style?.isItalic ? 'italic' : 'normal',
    style?.isBold ? 'bold' : '500',
    style?.fontSize || DEFAULT_FONT_SIZE,
    style?.fontFamily,
  );
  return {
    backgroundColor: style?.fillColor || 'inherit',
    color: style?.fontColor || DEFAULT_FONT_COLOR,
    font,
  };
}

const inputId = 'formula-editor';

export const FormulaEditor: SmartComponent = (state, controller) => {
  const { activeCell, isCellEditing, editCellValue } = state;
  const initValue = activeCell.formula || String(activeCell.value || '');

  return h('input', {
    className: 'base-editor',
    id: inputId,
    value: isCellEditing ? editCellValue : initValue,
    style: isCellEditing ? undefined : getEditorStyle(activeCell.style),
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
