import { h, Component } from '@/react';
import { FormulaEditor } from './FormulaEditor';
import { intToColumnName } from '@/util';
const activeCell = {
  row: 23,
  col: 22,
};
export const FormulaBarContainer: Component = () => {
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
    h('div', { className: 'formula-bar-editor-wrapper' }, h(FormulaEditor, {})),
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
