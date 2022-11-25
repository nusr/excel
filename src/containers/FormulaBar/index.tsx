import { h, SmartComponent } from '@/react';
import { FormulaEditor } from './FormulaEditor';
import { intToColumnName } from '@/util';

export const FormulaBarContainer: SmartComponent = (
  state,
  controller,
) => {
  const { activeCell } = state;
  return h(
    'div',
    {
      className: 'formula-bar-wrapper',
    },
    h(
      'div',
      { className: 'formula-bar-name' },
      `${intToColumnName(activeCell.col)}${activeCell.row + 1}`,
    ),
    h(
      'div',
      { className: 'formula-bar-editor-wrapper' },
      FormulaEditor(state, controller),
    ),
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
