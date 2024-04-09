import React, { CSSProperties, useRef, useEffect, memo } from 'react';
import { IController, EditorStatus, StyleType } from '@/types';
import styles from './index.module.css';
import { CellStoreType } from '../store';
import { MAX_NAME_LENGTH, FORMULA_EDITOR_ROLE } from '@/util';
import { coreStore } from '../store';

interface Props {
  controller: IController;
  initValue: string;
  style: CSSProperties | undefined;
  testId?: string;
}
export function getDisplayStyle(
  style: StyleType,
  isFormulaBar = true,
): CSSProperties {
  const result: CSSProperties = {};
  if (style?.isItalic) {
    result.fontStyle = 'italic';
  }
  if (style?.isBold) {
    result.fontWeight = 'bold';
  }
  if (style?.fontFamily) {
    result.fontFamily = style?.fontFamily;
  }
  if (style?.fontSize && !isFormulaBar) {
    result.fontSize = style?.fontSize;
  }
  if (style?.fillColor && !isFormulaBar) {
    result.backgroundColor = style.fillColor;
  }
  if (style?.fontColor && !isFormulaBar) {
    result.color = style?.fontColor;
  }
  if (style?.underline && style?.isStrike) {
    result.textDecorationLine = 'underline line-through';
  } else if (style?.underline) {
    result.textDecorationLine = 'underline';
  } else if (style?.isStrike) {
    result.textDecorationLine = 'line-through';
  }
  // if (style.underline === EUnderLine.DOUBLE) {
  //   result.textDecorationStyle = 'double';
  // }
  return result;
}
export function getEditorStyle(
  style: CellStoreType,
  editorStatus: EditorStatus,
  cellStyle: StyleType,
): CSSProperties | undefined {
  if (editorStatus === EditorStatus.NONE) {
    return undefined;
  }
  const isFormulaBar = editorStatus === EditorStatus.EDIT_FORMULA_BAR;

  const editorStyle = getDisplayStyle(cellStyle, isFormulaBar);
  if (isFormulaBar) {
    return editorStyle;
  }
  return {
    ...editorStyle,
    top: style.top,
    left: style.left,
    width: style.width,
    height: style.height,
    border: '1px solid var(--primaryColor)',
  };
}

export const FormulaEditor: React.FunctionComponent<Props> = memo(
  ({ controller, initValue, style, testId }) => {
    const ref = useRef<HTMLInputElement>(null);
    useEffect(() => {
      if (!ref.current) {
        return;
      }
      ref.current.focus();
    }, []);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
      event.stopPropagation();
      if (event.key === 'Enter' || event.key === 'Tab') {
        controller.batchUpdate(() => {
          controller.setCell(
            [[event.currentTarget.value]],
            [],
            controller.getActiveCell(),
          );
          if (event.key === 'Enter') {
            controller.setNextActiveCell('down');
          } else {
            controller.setNextActiveCell('right');
          }
        });
        coreStore.mergeState({
          editorStatus: EditorStatus.NONE,
        });
        ref.current!.value = '';
        ref.current!.blur();
      }
    };
    return (
      <input
        className={styles['formula-editor']}
        ref={ref}
        spellCheck
        defaultValue={initValue}
        onKeyDown={handleKeyDown}
        type="text"
        style={style}
        maxLength={MAX_NAME_LENGTH * 100}
        data-testid={testId}
        data-role={FORMULA_EDITOR_ROLE}
      />
    );
  },
);

FormulaEditor.displayName = 'FormulaEditor';
