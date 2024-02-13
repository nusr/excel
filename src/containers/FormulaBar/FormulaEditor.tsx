import React, { CSSProperties, useRef, useEffect } from 'react';
import { CanvasOverlayPosition, IController, EditorStatus } from '@/types';
import styles from './index.module.css';
import { CellStoreType } from '../store';
import { handleTabClick, handleEnterClick } from '../../canvas/shortcut';

interface Props {
  controller: IController;
  initValue: string;
  style: CSSProperties | undefined;
}
export function getDisplayStyle(
  style: CellStoreType,
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
): CSSProperties | undefined {
  if (editorStatus === EditorStatus.NONE) {
    return undefined;
  }
  const isFormulaBar = editorStatus === EditorStatus.EDIT_FORMULA_BAR;

  const editorStyle = getDisplayStyle(style, isFormulaBar);
  if (isFormulaBar) {
    return editorStyle;
  }
  const cellPosition: CanvasOverlayPosition = {
    top: style.top,
    left: style.left,
    width: style.width,
    height: style.height,
  };
  return {
    ...editorStyle,
    ...cellPosition,
    border: '1px solid var(--primaryColor)',
  };
}

export const FormulaEditor: React.FunctionComponent<Props> = ({
  controller,
  initValue,
  style,
}) => {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    controller.setMainDom({ input: ref.current });
  }, []);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    event.stopPropagation();
    if (event.key === 'Enter') {
      controller.transaction(() => {
        handleEnterClick(controller);
      });
    } else if (event.key === 'Tab') {
      controller.transaction(() => {
        handleTabClick(controller);
      });
    }
  };
  return (
    <input
      className={styles['base-editor']}
      ref={ref}
      defaultValue={initValue}
      onKeyDown={handleKeyDown}
      type="text"
      style={style}
    />
  );
};

FormulaEditor.displayName = 'FormulaEditor';
