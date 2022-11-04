import { h } from '@/react';
import { FormulaEditor } from './FormulaEditor';
import { intToColumnName } from '@/util';
const text = 'A1';
export const FormulaBarContainer = () => {
  // const { activeCell } = useSelector(["activeCell"]);
  // const { row, col } = activeCell;
  // const text = useMemo(() => {
  // return `${intToColumnName(col)}${row + 1}`;
  // }, [row, col]);
  return h(
    'div',
    {
      className: 'formula-bar-wrapper',
    },
    h('div', { className: 'formula-bar-name' }, text),
    h('div', { className: 'formula-bar-editor-wrapper' }, h(FormulaEditor, {})),
  );
  // return (
  // <div className="formula-bar-wrapper" id="formula-bar-container">
  {
    /* <div className="formula-bar-name">{text}</div> */
  }
  {
    /* <div className="formula-bar-editor-wrapper"> */
  }
  {
    /* <FormulaEditor /> */
  }
  {
    /* </div> */
  }
  {
    /* </div> */
  }
  // );
};
