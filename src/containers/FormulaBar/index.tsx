import React, { useSyncExternalStore, useMemo, memo, useCallback } from 'react';
import {
  MultipleLineEditor,
  getEditorStyle,
  getDisplayStyle,
} from './FormulaEditor';
import { LINE_BREAK, classnames, intToColumnName } from '@/util';
import styles from './index.module.css';
import { IController, EditorStatus } from '@/types';
import { activeCellStore, coreStore, styleStore } from '@/containers/store';
import { DefineName } from './DefineName';

interface Props {
  controller: IController;
}

export const FormulaBarContainer: React.FunctionComponent<Props> = memo(
  ({ controller }) => {
    const activeCell = useSyncExternalStore(
      activeCellStore.subscribe,
      activeCellStore.getSnapshot,
    );
    const cellStyle = useSyncExternalStore(
      styleStore.subscribe,
      styleStore.getSnapshot,
    );
    const { editorStatus } = useSyncExternalStore(
      coreStore.subscribe,
      coreStore.getSnapshot,
    );
    const displayName = useMemo(() => {
      return (
        activeCell.defineName ||
        `${intToColumnName(activeCell.col)}${activeCell.row + 1}`
      );
    }, [activeCell.defineName, activeCell.col, activeCell.row]);
    const handleClick = useCallback(() => {
      coreStore.mergeState({
        editorStatus: EditorStatus.EDIT_FORMULA_BAR,
      });
    }, []);
    const style = useMemo(() => {
      return getDisplayStyle(cellStyle);
    }, [cellStyle]);

    return (
      <div className={styles['formula-bar-wrapper']} data-testid="formula-bar">
        <DefineName
          controller={controller}
          displayName={displayName}
          defineName={activeCell.defineName}
        />
        <div className={styles['formula-bar-editor-wrapper']}>
          {editorStatus !== EditorStatus.NONE && (
            <MultipleLineEditor
              initValue={activeCell.value}
              controller={controller}
              style={getEditorStyle(activeCell, editorStatus, cellStyle)}
              testId="formula-editor"
              isMergeCell={cellStyle.isMergeCell}
              className={
                editorStatus === EditorStatus.EDIT_CELL
                  ? styles['edit-cell']
                  : ''
              }
            />
          )}
          <div
            className={classnames(styles['formula-bar-value'], {
              [styles['show']]: editorStatus !== EditorStatus.EDIT_FORMULA_BAR,
              [styles['wrap']]:
                cellStyle.isMergeCell &&
                activeCell.value.includes(LINE_BREAK) &&
                cellStyle.isWrapText,
            })}
            style={style}
            onClick={handleClick}
            data-testid="formula-editor-trigger"
          >
            {activeCell.value}
          </div>
        </div>
      </div>
    );
  },
);
FormulaBarContainer.displayName = 'FormulaBarContainer';
