import { h, SmartComponent, CSSProperties } from '@/react';
import { QueryCellResult, CanvasOverlayPosition } from '@/types';
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
  FORMULA_EDITOR_ID,
  isEmpty,
} from '@/util';

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
  const { activeCell, isCellEditing, cellPosition } = state;
  const initValue = activeCell.formula || String(activeCell.value || '');
  let inputDom: HTMLInputElement;
  const ref = (element: Element) => {
    inputDom = element as HTMLInputElement;
  };

  const setValue = (value: string) => {
    controller.setCellValues([[value]], [], controller.getRanges());
    inputDom.value = '';
    state.isCellEditing = false;
  };
  return h('input', {
    title: 'editor',
    className: 'base-editor',
    id: FORMULA_EDITOR_ID,
    value: initValue,
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
      setValue(event.currentTarget.value);
    },
    onkeydown: (event: any) => {
      inputDom.nextSibling!.textContent = event.currentTarget.value;
      if (event.key === 'Enter' || event.key === 'Tab') {
        setValue(event.currentTarget.value);
      }
    },
  });
};

FormulaEditor.displayName = 'FormulaEditor';
