import React, { useSyncExternalStore, useMemo } from 'react';
import {
  FormulaEditor,
  getEditorStyle,
  getDisplayStyle,
} from './FormulaEditor';
import { classnames, intToColumnName } from '@/util';
import styles from './index.module.css';
import { IController, EditorStatus } from '@/types';
import { activeCellStore, coreStore } from '@/containers/store';
import { DefineName } from './DefineName';

interface Props {
  controller: IController;
}

export const FormulaBarContainer: React.FunctionComponent<Props> = ({
  controller,
}) => {
  const activeCell = useSyncExternalStore(
    activeCellStore.subscribe,
    activeCellStore.getSnapshot,
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
  const editorValue = activeCell.formula || String(activeCell.value || '');
  // const style = useMemo(() => {
  //   return getEditorStyle(activeCell, editorStatus);
  // }, [activeCell, editorStatus]);
  const handleClick = () => {
    coreStore.mergeState({
      editorStatus: EditorStatus.EDIT_FORMULA_BAR,
    });
    controller.getMainDom().input?.focus();
  };
  return (
    <div className={styles['formula-bar-wrapper']} data-testid="formula-bar">
      <DefineName controller={controller} displayName={displayName} />
      <div className={styles['formula-bar-editor-wrapper']}>
        {editorStatus !== EditorStatus.NONE ? (
          <FormulaEditor
            controller={controller}
            initValue={editorValue}
            style={getEditorStyle(activeCell, editorStatus)}
          />
        ) : null}
        <div
          className={classnames(styles['formula-bar-value'], {
            [styles['show']]: editorStatus !== EditorStatus.EDIT_FORMULA_BAR,
          })}
          style={getDisplayStyle(activeCell)}
          onClick={handleClick}
        >
          {editorValue}
        </div>
      </div>
    </div>
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
