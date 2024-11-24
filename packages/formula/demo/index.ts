import { parseFormula, CellDataMapImpl } from '../src';
import { parseReference } from '@excel/shared';

const cellDataMap = new CellDataMapImpl();

cellDataMap.setSheetList([
  {
    sheetId: '1',
    rowCount: 200,
    colCount: 200,
    name: 'Sheet1',
    isHide: false,
    sort: 1,
  },
]);

const reference = document.getElementById('reference')! as HTMLTextAreaElement;
const formula = document.getElementById('formula')! as HTMLTextAreaElement;
const formulaResult = document.getElementById('result')!;
const submitButton = document.getElementById('submit')!;

function parse() {
  parseRef()
  const result = parseFormula(formula.value, { row: 0, col: 0 }, cellDataMap);
  formulaResult.innerText = result.result.join('\t');
}
function parseRef() {
  const text = reference.value.split('\n').map((v) => v.trim());
  if (text.length === 0) {
    return;
  }
  for (const item of text) {
    const [ref, value] = item.split('=');
    const range = parseReference(ref);
    if (!range) {
      continue;
    }
    cellDataMap.set(
      { row: range.row, col: range.col, rowCount: 1, colCount: 1, sheetId: '' },
      [[value]],
    );
  }
}

submitButton.addEventListener('click', () => {
  parse();
});

formula.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    parse();
  }
});

reference.value = 'B1=1.5\nB2=30'
formula.value = 'SUM(B1,B2)';
parse();
