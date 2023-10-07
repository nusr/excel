import React, {
  CSSProperties,
  useSyncExternalStore,
  useRef,
  useEffect,
} from 'react';
import { CanvasOverlayPosition, ActiveCellType, IController } from '@/types';
import {
  DEFAULT_FONT_COLOR,
  makeFont,
  DEFAULT_FONT_SIZE,
  isEmpty,
} from '@/util';
import styles from './index.module.css';
import { activeCellStore, coreStore } from '@/containers/store';

type Props = {
  controller: IController;
};

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

export const FormulaEditor: React.FunctionComponent<Props> = ({
  controller,
}) => {
  const activeCell = useSyncExternalStore(
    activeCellStore.subscribe,
    activeCellStore.getSnapshot,
  );
  const { isCellEditing } = useSyncExternalStore(
    coreStore.subscribe,
    coreStore.getSnapshot,
  );
  const initValue = activeCell.formula || String(activeCell.value || '');
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    controller.setMainDom({ input: ref.current });
  }, []);
  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const val = event.currentTarget.value;
    if (event.key === 'Enter' || event.key === 'Tab') {
      const activeCell = controller.getActiveCell();
      ref.current!.blur();
      ref.current!.value = '';
      controller.setCellValues([[val]], [], [activeCell]);
      if (event.key === 'Enter') {
        controller.setActiveCell({
          row: activeCell.row + 1,
          col: activeCell.col,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        });
      } else if (event.key === 'Tab') {
        controller.setActiveCell({
          row: activeCell.row,
          col: activeCell.col + 1,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        });
      }
      return;
    }
    if (ref.current) {
      ref.current.nextSibling!.textContent = val;
    }
  };
  return (
    <input
      className={styles['base-editor']}
      ref={ref}
      defaultValue={initValue}
      type="text"
      style={isCellEditing ? getEditorStyle(activeCell) : undefined}
      onFocus={() => {
        if (!isCellEditing) {
          return;
        }
        coreStore.mergeState({ isCellEditing: true });
      }}
      onKeyDown={handleKeyDown}
    ></input>
  );
};

FormulaEditor.displayName = 'FormulaEditor';
