import { IController, ResultType } from '@/types';
import { saveAs, coordinateToString, assert } from '@/util';

function processItem(value: any) {
  const type = typeof value;
  if (type === 'string') {
    return value;
  } else if (type === 'bigint') {
    return '' + value;
  } else if (type === 'number') {
    return '' + value;
  } else if (type === 'boolean') {
    return value ? 'TRUE' : 'FALSE';
  } else if (value instanceof Date) {
    return '' + value.getTime();
  } else if (type === 'object' && value !== null) {
    return JSON.stringify(value);
  } else {
    return '';
  }
}

function processRow(row: any[]) {
  const delimiter = ',';
  const quote = '"';
  const escape_formulas = false;
  const quoted_string = false;
  const escape = '"';
  const quoted = false;
  const record_delimiter = '\n';

  let csvRecord = '';
  for (let j = 0; j < row.length; j++) {
    const field = row[j];
    let value = processItem(field);
    if ('' === value) {
      csvRecord += value;
    } else if (value) {
      assert(
        typeof value === 'string',
        `Formatter must return a string, null or undefined, got ${JSON.stringify(
          value,
        )}`,
      );
      const containsdelimiter =
        delimiter.length && value.indexOf(delimiter) >= 0;
      const containsQuote = value.indexOf(quote) >= 0;
      const containsEscape = value.indexOf(escape) >= 0 && escape !== quote;
      const containsRecordDelimiter = value.indexOf(record_delimiter) >= 0;
      const quotedString = quoted_string && typeof field === 'string';
      if (escape_formulas) {
        switch (value[0]) {
          case '=':
          case '+':
          case '-':
          case '@':
          case '\t':
          case '\r':
          case '\uFF1D': // Unicode '='
          case '\uFF0B': // Unicode '+'
          case '\uFF0D': // Unicode '-'
          case '\uFF20': // Unicode '@'
            value = `'${value}`;
            break;
        }
      }
      const shouldQuote =
        containsQuote === true ||
        containsdelimiter ||
        containsRecordDelimiter ||
        quoted ||
        quotedString;
      if (shouldQuote === true && containsEscape === true) {
        const regexp =
          escape === '\\'
            ? // @ts-ignore
              new RegExp(escape + escape, 'g')
            : new RegExp(escape, 'g');
        value = value.replace(regexp, escape + escape);
      }
      if (containsQuote === true) {
        const regexp = new RegExp(quote, 'g');
        value = value.replace(regexp, escape + quote);
      }
      if (shouldQuote === true) {
        value = quote + value + quote;
      }
      csvRecord += value;
    }
    if (j !== row.length - 1) {
      csvRecord += delimiter;
    }
  }
  return csvRecord;
}
export function exportToCsv(fileName: string, controller: IController) {
  const sheetData =
    controller.toJSON().worksheets[controller.getCurrentSheetId()];
  const csvList: string[] = [];
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
        const t = value.formula || value.value;
        list.push(t);
      }
      csvList.push(processRow(list));
    }
  }
  const blob = new Blob([csvList.join('\n')], {
    type: 'text/csv;charset=utf-8;',
  });
  saveAs(blob, fileName);
}
