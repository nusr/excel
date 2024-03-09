import { IController, ResultType } from '@/types';
import { saveAs, coordinateToString } from '@/util';

function processRow(row: ResultType[]) {
  let finalVal = '';
  for (let j = 0; j < row.length; j++) {
    const t = row[j] ?? '';
    let innerValue = '';
    if (t === 0) {
      innerValue = t.toString();
    }
    if (t) {
      innerValue = t.toString();
    }
    let result = innerValue.replace(/"/g, '""');
    if (result.search(/("|,|\n)/g) >= 0) {
      result = `"${result}"`;
    }
    if (j > 0) {
      finalVal += ',';
    }
    finalVal += result;
  }
  return `${finalVal}\n`;
}
export function exportToCsv(fileName: string, controller: IController) {
  const sheetData =
    controller.toJSON().worksheets[controller.getCurrentSheetId()];
  let csvFile = '';
  const sheetInfo = controller.getSheetInfo(controller.getCurrentSheetId())!;
  if (sheetData) {
    for (let row = 0; row < sheetInfo.rowCount; row++) {
      const list: ResultType[] = [];
      for (let col = 0; col < sheetInfo.colCount; col++) {
        const key = coordinateToString(row, col);
        const value = sheetData[key];
        if (!value) {
          list.push('');
          continue;
        }
        const t = value.formula ?? value.value;
        list.push(t);
      }
      csvFile += processRow(list);
    }
  }
  const blob = new Blob([csvFile], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, fileName);
}
