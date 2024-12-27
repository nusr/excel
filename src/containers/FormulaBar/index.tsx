import { useMemo, memo, useCallback } from 'react';
import {
  MultipleLineEditor,
  getEditorStyle,
  getDisplayStyle,
} from './FormulaEditor';
import { LINE_BREAK, classnames, convertToReference } from '../../util';
import styles from './index.module.css';
import { EditorStatus } from '../../types';
import {
  useActiveCell,
  useCoreStore,
  useStyleStore,
} from '../../containers/store';
import { DefineName } from './DefineName';

export const FormulaBarContainer = memo(() => {
  const activeCell = useActiveCell();
  const cellStyle = useStyleStore();
  const editorStatus = useCoreStore((state) => state.editorStatus);
  const setEditorStatus = useCoreStore((state) => state.setEditorStatus);

  const displayName = useMemo(() => {
    return (
      activeCell.defineName ||
      convertToReference({
        row: activeCell.row,
        col: activeCell.col,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      })
    );
  }, [activeCell.defineName, activeCell.col, activeCell.row]);
  const handleClick = useCallback(() => {
    setEditorStatus(EditorStatus.EDIT_FORMULA_BAR);
  }, []);
  const style = useMemo(() => {
    return getDisplayStyle(cellStyle);
  }, [cellStyle]);

  return (
    <div className={styles['formula-bar-wrapper']} data-testid="formula-bar">
      <DefineName
        displayName={displayName}
        defineName={activeCell.defineName}
      />
      <div className={styles['formula-bar-editor-wrapper']}>
        {editorStatus !== EditorStatus.NONE && (
          <MultipleLineEditor
            initValue={activeCell.value}
            style={getEditorStyle(activeCell, editorStatus, cellStyle)}
            testId="formula-editor"
            isMergeCell={cellStyle.isMergeCell}
            className={
              editorStatus === EditorStatus.EDIT_CELL ? styles['edit-cell'] : ''
            }
          />
        )}
        <div
          className={classnames(styles['formula-bar-value'], {
            [styles['show']]: editorStatus !== EditorStatus.EDIT_FORMULA_BAR,
            [styles['wrap']]:
              cellStyle.isMergeCell &&
              activeCell.displayValue.includes(LINE_BREAK),
          })}
          style={style}
          onClick={handleClick}
          data-testid="formula-editor-trigger"
        >
          {activeCell.displayValue}
        </div>
      </div>
    </div>
  );
});
FormulaBarContainer.displayName = 'FormulaBarContainer';

export default FormulaBarContainer;
