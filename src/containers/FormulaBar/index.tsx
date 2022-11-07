import { h, Component, text } from '@/react';
import { FormulaEditor } from './FormulaEditor';
import { intToColumnName } from '@/util';
import globalStore from '@/store';

export const FormulaBarContainer: Component = () => {
  const activeCell = globalStore.value.activeCell;
  return h(
    'div',
    {
      className: 'formula-bar-wrapper',
    },
    h(
      'div',
      { className: 'formula-bar-name' },
      text(`${intToColumnName(activeCell.col)}${activeCell.row + 1}`),
    ),
    h('div', { className: 'formula-bar-editor-wrapper' }, FormulaEditor({})),
  );
};
FormulaBarContainer.displayName = 'FormulaBarContainer';
