import React, { useSyncExternalStore, useMemo } from 'react';
import { FormulaEditor, getEditorStyle } from './FormulaEditor';
import { intToColumnName, classnames } from '@/util';
import styles from './index.module.css';
import { IController } from '@/types';
import { activeCellStore, coreStore } from '@/containers/store';

type Props = {
  controller: IController;
};

export const FormulaBarContainer: React.FunctionComponent<Props> = ({
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
  const name = useMemo(() => {
    return `${intToColumnName(activeCell.col)}${activeCell.row + 1}`;
  }, [activeCell]);
  const showText = !isCellEditing || activeCell.top > 0 || activeCell.left > 0;
  const editorValue = activeCell.formula || String(activeCell.value || '');
  const style = useMemo(() => {
    return getEditorStyle(activeCell);
  }, [activeCell]);
  return (
    <div className={styles['formula-bar-wrapper']} data-testid="formula-bar">
      <div
        className={styles['formula-bar-name']}
        data-testid="formula-bar-name"
      >
        {name}
      </div>
      <div className={styles['formula-bar-editor-wrapper']}>
        {isCellEditing ? (
          <FormulaEditor
            controller={controller}
            initValue={editorValue}
            style={style}
          />
        ) : null}
        <div
          className={classnames(styles['formula-bar-value'], {
            [styles['show']]: showText,
          })}
        >
          {editorValue}
        </div>
      </div>
    </div>
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
