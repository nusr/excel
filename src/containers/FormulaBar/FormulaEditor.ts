import { h, SmartComponent, CSSProperties } from '@/react';
import { QueryCellResult, CanvasOverlayPosition } from '@/types';
import { DEFAULT_FONT_COLOR, makeFont, DEFAULT_FONT_SIZE } from '@/util';
import { isEmpty } from '@/lodash';

export function getEditorStyle(
  style: QueryCellResult['style'],
  cellPosition: CanvasOverlayPosition,
): CSSProperties | undefined {
  if (isEmpty(style)) {
    return cellPosition;
  }
  const font = makeFont(
    style?.isItalic ? 'italic' : 'normal',
    style?.isBold ? 'bold' : '500',
    style?.fontSize || DEFAULT_FONT_SIZE,
    style?.fontFamily,
  );
  return {
    ...cellPosition,
    backgroundColor: style?.fillColor || 'inherit',
    color: style?.fontColor || DEFAULT_FONT_COLOR,
    font,
  };
}

const inputId = 'formula-editor';

export const FormulaEditor: SmartComponent = (state, controller) => {
  const { activeCell, isCellEditing, editCellValue, cellPosition } = state;
  const initValue = activeCell.formula || String(activeCell.value || '');

  return h('input', {
    title: 'editor',
    className: 'base-editor',
    id: inputId,
    value: isCellEditing ? editCellValue : initValue,
    style: isCellEditing
      ? getEditorStyle(activeCell.style, cellPosition)
      : undefined,
    onfocus: () => {
      if (!isCellEditing) {
        return;
      }
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
      state.isCellEditing = false;
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
