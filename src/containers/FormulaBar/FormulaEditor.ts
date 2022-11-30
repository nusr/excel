import { h, SmartComponent, CSSProperties } from '@/react';
import { QueryCellResult, CanvasOverlayPosition } from '@/types';
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
  FORMULA_EDITOR_ID,
} from '@/util';
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

export const FormulaEditor: SmartComponent = (state, controller) => {
  const { activeCell, isCellEditing, editCellValue, cellPosition } = state;
  const initValue = activeCell.formula || String(activeCell.value || '');
  let inputDom: HTMLInputElement;
  const ref = (element: Element) => {
    inputDom = element as HTMLInputElement;
  };
  return h('input', {
    title: 'editor',
    className: 'base-editor',
    id: FORMULA_EDITOR_ID,
    value: isCellEditing ? editCellValue : initValue,
    style: isCellEditing
      ? getEditorStyle(activeCell.style, cellPosition)
      : undefined,
    hook: {
      ref,
    },
    onfocus: () => {
      if (!isCellEditing) {
        return;
      }
      state.isCellEditing = true;
    },
    onblur: (event: any) => {
      controller.setCellValue(activeCell, event.target.value);
      if (event.target === inputDom) {
        inputDom.value = '';
        controller.setActiveCell(activeCell.row + 1, activeCell.col, 1, 1);
      }
      state.editCellValue = '';
      state.isCellEditing = false;
    },
    onkeydown: (event: any) => {
      if (event.key === 'Enter') {
        inputDom.blur();
      } else {
        state.editCellValue = event.target.value;
      }
    },
  });
};

FormulaEditor.displayName = 'FormulaEditor';
