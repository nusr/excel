import React, { useSyncExternalStore, useMemo, memo } from 'react';
import {
  FormulaEditor,
  getEditorStyle,
  getDisplayStyle,
} from './FormulaEditor';
import { classnames, intToColumnName } from '@/util';
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
    }, [activeCell]);
    const handleClick = () => {
      coreStore.mergeState({
        editorStatus: EditorStatus.EDIT_FORMULA_BAR,
      });
    };
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
            <FormulaEditor
              controller={controller}
              initValue={activeCell.value}
              style={getEditorStyle(activeCell, editorStatus, cellStyle)}
              testId="formula-editor"
            />
          )}
          <div
            className={classnames(styles['formula-bar-value'], {
              [styles['show']]: editorStatus !== EditorStatus.EDIT_FORMULA_BAR,
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
