import { IController } from '@excel/shared';
import { CSV_SPLITTER, LINE_BREAK } from '@excel/shared';
import { numberFormat } from '@excel/formula';

const DELIMITER = CSV_SPLITTER;
const RECORD_DELIMITER = LINE_BREAK;

function processRow(row: string[]) {
  const quote = '"';
  const escape = '"';
  const escapeReg = new RegExp(escape, 'g');
  const quoteReg = new RegExp(quote, 'g');

  let csvRecord = '';
  for (let j = 0; j < row.length; j++) {
    let value = row[j];
    if ('' === value) {
      csvRecord += value;
    } else if (value) {
      const containDelimiter =
        DELIMITER.length && value.indexOf(DELIMITER) >= 0;
      const containsQuote = value.indexOf(quote) >= 0;
      const containsRecordDelimiter = value.indexOf(RECORD_DELIMITER) >= 0;
      const shouldQuote =
        containsQuote || containDelimiter || containsRecordDelimiter;
      if (shouldQuote) {
        value = value.replace(escapeReg, escape + escape);
      }
      if (containsQuote) {
        value = value.replace(quoteReg, escape + quote);
      }
      if (shouldQuote) {
        value = quote + value + quote;
      }
      csvRecord += value;
    }
    if (j !== row.length - 1) {
      csvRecord += DELIMITER;
    }
  }
  return csvRecord;
}
export function exportToCsv(controller: IController): string {
  const currentSheetId = controller.getCurrentSheetId();
  const csvList: string[] = [];
  const sheetInfo = controller.getSheetInfo(currentSheetId);
  if (!sheetInfo) {
    return ''
  }

  for (let row = 0; row < sheetInfo.rowCount; row++) {
    const list: string[] = [];
    for (let col = 0; col < sheetInfo.colCount; col++) {
      const cell = controller.getCell({
        row,
        col,
        colCount: 1,
        rowCount: 1,
        sheetId: currentSheetId,
      });
      list.push(numberFormat(cell?.value, cell?.numberFormat));
    }
    csvList.push(processRow(list));
  }

  const base = Array.from({ length: sheetInfo.colCount })
    .fill('')
    .join(DELIMITER);
  // delete empty row
  while (csvList.length > 0) {
    if (csvList[csvList.length - 1] === base) {
      csvList.pop();
    } else {
      break;
    }
  }
  return csvList.join(RECORD_DELIMITER);
}
