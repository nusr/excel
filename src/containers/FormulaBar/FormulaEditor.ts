import { h, SmartComponent, CSSProperties } from '@/react';
import { CanvasOverlayPosition, ActiveCellType } from '@/types';
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
  isEmpty,
} from '@/util';
import styles from './index.module.css';

function getEditorStyle(data: ActiveCellType): CSSProperties | undefined {
  const { style } = data;
  const cellPosition: CanvasOverlayPosition = {
    top: data.top,
    left: data.left,
    width: data.width,
    height: data.height,
  };
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
  const { activeCell, isCellEditing } = state;
  const initValue = activeCell.formula || String(activeCell.value || '');
  let inputDom: HTMLInputElement;
  const ref = (element: Element) => {
    inputDom = element as HTMLInputElement;
    controller.setMainDom({ input: inputDom });
  };
  return h('input', {
    className: styles['base-editor'],
    value: initValue,
    type: 'text',
    style: isCellEditing ? getEditorStyle(activeCell) : undefined,
    hook: {
      ref,
    },
    onfocus: () => {
      if (!isCellEditing) {
        return;
      }
      state.isCellEditing = true;
    },
    onkeydown: (event: any) => {
      if (isCellEditing) {
        inputDom.nextSibling!.textContent = event.currentTarget.value;
      }
    },
  });
};

FormulaEditor.displayName = 'FormulaEditor';
