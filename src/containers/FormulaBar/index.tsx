import React, { useSyncExternalStore } from 'react';
import { FormulaEditor } from './FormulaEditor';
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
  const name = `${intToColumnName(activeCell.col)}${activeCell.row + 1}`;
  const showText = !isCellEditing || activeCell.top > 0 || activeCell.left > 0;
  return (
    <div className={styles['formula-bar-wrapper']} data-testid="formula-bar">
      <div
        className={styles['formula-bar-name']}
        data-testid="formula-bar-name"
      >
        {name}
      </div>
      <div className={styles['formula-bar-editor-wrapper']}>
        <FormulaEditor controller={controller} />
        <div
          className={classnames(styles['formula-bar-value'], {
            [styles['show']]: showText,
          })}
        >
          {activeCell.formula || String(activeCell.value || '')}
        </div>
      </div>
    </div>
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
