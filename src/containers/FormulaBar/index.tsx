import { h, Component } from '@/react';
import { FormulaEditor } from './FormulaEditor';
import { intToColumnName } from '@/util';
import globalStore from '@/store';

export const FormulaBarContainer: Component = () => {
  const activeCell = globalStore.get('activeCell');
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
