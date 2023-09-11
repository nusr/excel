import { h, SmartComponent } from '@/react';
import { FormulaEditor } from './FormulaEditor';
import { intToColumnName, classnames } from '@/util';
import styles from './index.module.css';

export const FormulaBarContainer: SmartComponent = (state, controller) => {
  const { activeCell } = state;
  return h(
    'div',
    {
      className: styles['formula-bar-wrapper'],
      "data-testId": 'formula-bar'
    },
    h(
      'div',
      {
        className: styles['formula-bar-name'],
        'data-testId': 'formula-bar-name',
      },
      `${intToColumnName(activeCell.col)}${activeCell.row + 1}`,
    ),
    h(
      'div',
      { className: styles['formula-bar-editor-wrapper'] },
      FormulaEditor(state, controller),
      h(
        'div',
        {
          className: classnames(styles['formula-bar-value'], {
            [styles['show']]: state.isCellEditing,
          }),
        },
        activeCell.formula || String(activeCell.value || ''),
      ),
    ),
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
