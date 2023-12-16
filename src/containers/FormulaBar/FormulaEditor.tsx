import React, { CSSProperties, useRef, useEffect } from 'react';
import { CanvasOverlayPosition, IController, EditorStatus } from '@/types';
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
} from '@/util';
import styles from './index.module.css';
import { CellStoreType } from '../store';

interface Props {
  controller: IController;
  initValue: string;
  style: CSSProperties | undefined;
}

export function getEditorStyle(
  style: CellStoreType,
  editorStatus: EditorStatus,
): CSSProperties | undefined {
  if (editorStatus === EditorStatus.NONE) {
    return undefined;
  }
  const cellPosition: CanvasOverlayPosition = {
    top: style.top,
    left: style.left,
    width: style.width,
    height: style.height,
  };
  const font = makeFont(
    style?.isItalic ? 'italic' : 'normal',
    style?.isBold ? 'bold' : '500',
    style?.fontSize || DEFAULT_FONT_SIZE,
    style?.fontFamily,
  );
  const editorStyle = {
    backgroundColor: style?.fillColor || 'inherit',
    color: style?.fontColor || DEFAULT_FONT_COLOR,
    font,
  };
  if (editorStatus === EditorStatus.EDIT_CELL) {
    return {
      ...editorStyle,
      ...cellPosition,
    };
  }
  return editorStyle;
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
  return (
    <input
      className={styles['base-editor']}
      ref={ref}
      defaultValue={initValue}
      type="text"
      style={style}
    />
  );
};

FormulaEditor.displayName = 'FormulaEditor';
