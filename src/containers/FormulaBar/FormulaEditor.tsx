import React, {
  CSSProperties,
  memo,
  useCallback,
  useState,
  useRef,
  useEffect,
} from 'react';
import { EditorStatus } from '../../types';
import styles from './index.module.css';
import {
  CellStoreType,
  useCoreStore,
  StyleStoreType,
  useExcel,
} from '../store';
import {
  MAX_NAME_LENGTH,
  FORMULA_EDITOR_ROLE,
  MERGE_CELL_LINE_BREAK,
  classnames,
  TEXTAREA_MAX_ROWS,
  LINE_BREAK,
  isMergeContent,
} from '../../util';

interface MultipleLineEditorProps {
  isMergeCell: boolean;
  initValue: string;
  style: CSSProperties | undefined;
  testId?: string;
  className?: string;
}
export function getDisplayStyle(
  style: StyleStoreType,
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
  return result;
}
export function getEditorStyle(
  style: CellStoreType,
  editorStatus: EditorStatus,
  cellStyle: StyleStoreType,
): CSSProperties | undefined {
  if (editorStatus === EditorStatus.NONE) {
    return undefined;
  }
  const isFormulaBar = editorStatus === EditorStatus.EDIT_FORMULA_BAR;

  const editorStyle: CSSProperties = getDisplayStyle(cellStyle, isFormulaBar);
  if (isFormulaBar) {
    return editorStyle;
  }
  const result: CSSProperties = {
    ...editorStyle,
    top: style.top,
    left: style.left,
    width: style.width,
    height: style.height,
    borderRadius: 0,
  };
  return result;
}

const minRows = 1;

function countRows(count: number) {
  return Math.max(Math.min(TEXTAREA_MAX_ROWS, count), minRows);
}

export const MultipleLineEditor: React.FunctionComponent<MultipleLineEditorProps> =
  memo(({ initValue, style, testId, isMergeCell, className }) => {
    const { controller } = useExcel();
    const setEditorStatus = useCoreStore((state) => state.setEditorStatus);
    const ref = useRef<HTMLTextAreaElement>(null);
    const [rowCount, setRowCount] = useState(minRows);
    useEffect(() => {
      if (isMergeCell) {
        const count = initValue.split(MERGE_CELL_LINE_BREAK).length;
        setRowCount(countRows(count));
      } else {
        const rows = Math.ceil((ref.current?.scrollHeight || 20) / 20);
        setRowCount(countRows(rows));
      }
    }, [isMergeCell, initValue]);
    const onKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        event.stopPropagation();
        if (event.key === 'Enter' || event.key === 'Tab') {
          let value = event.currentTarget.value;
          const { range, isMerged } = controller.getActiveRange();
          const cellData = controller.getCell(range);
          if (
            typeof cellData?.value === 'string' &&
            isMergeContent(isMerged, cellData?.value)
          ) {
            value = value.replaceAll(LINE_BREAK, MERGE_CELL_LINE_BREAK);
          }
          controller.transaction(() => {
            controller.setCellValue(value, range);
            if (event.key === 'Enter') {
              controller.setNextActiveCell('down');
            } else {
              controller.setNextActiveCell('right');
            }
          });
          setEditorStatus(EditorStatus.NONE);
          event.currentTarget.value = '';
          event.currentTarget.blur();
        } else {
          const rows = Math.ceil(event.currentTarget.scrollHeight / 20);
          setRowCount(countRows(rows));
        }
      },
      [],
    );
    return (
      <textarea
        spellCheck
        autoFocus
        ref={ref}
        style={style}
        maxLength={MAX_NAME_LENGTH * 100}
        data-testid={testId}
        data-role={FORMULA_EDITOR_ROLE}
        onKeyDown={onKeyDown}
        className={classnames(styles['formula-editor'], className)}
        defaultValue={initValue}
        rows={rowCount}
      />
    );
  });

MultipleLineEditor.displayName = 'MultipleLineEditor';
