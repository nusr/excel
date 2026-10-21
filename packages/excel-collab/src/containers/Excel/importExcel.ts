import type { NewFile } from 'excelize-wasm';
import type { ModelJSON, ModelCellType } from '../../types';
import {
  getWorksheetKey,
  getCustomWidthOrHeightKey,
  parseReference,
  convertFileToTextOrBase64,
  intToColumnName,
  FORMULA_PREFIX,
  DEFAULT_ROW_COUNT,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
} from '../../util';
import { loadExcelize, checkExcelize, type Excelize } from './excelize';
import { fromExcelizeStyle } from './excelizeStyle';

type ExcelInput = File | Blob | ArrayBuffer | Uint8Array | ArrayLike<number>;

const DEFAULT_COL_COUNT = 200;

export const IMPORT_ACCEPT = '.xlsx,.xlsm,.xlam,.xltm,.xltx,.csv';

function emptyModel(): ModelJSON {
  return {
    workbook: {}, mergeCells: {}, customHeight: {}, customWidth: {},
    definedNames: {}, currentSheetId: '', drawings: {}, rangeMap: {},
    worksheets: {}, autoFilter: {}, scroll: {},
  };
}

async function toUint8Array(file: ExcelInput): Promise<Uint8Array> {
  if ('arrayBuffer' in Object(file) && typeof (file as Blob).arrayBuffer === 'function') {
    return new Uint8Array(await (file as Blob).arrayBuffer());
  }
  if (typeof Blob !== 'undefined' && file instanceof Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result instanceof ArrayBuffer) resolve(new Uint8Array(reader.result));
        else reject(new TypeError('Expected binary spreadsheet data'));
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsArrayBuffer(file);
    });
  }
  if (file instanceof ArrayBuffer) return new Uint8Array(file);
  return new Uint8Array(file as ArrayLike<number>);
}

function coordinates(reference: string): { row: number; col: number } {
  const range = parseReference(reference);
  if (!range) throw new Error(`Invalid cell reference: ${reference}`);
  return { row: range.row, col: range.col };
}

function readCell(file: NewFile, api: Excelize, sheet: string, axis: string, mergedFollower: boolean): ModelCellType | undefined {
  const raw = mergedFollower ? '' : checkExcelize(file.GetCellValue(sheet, axis, { RawCellValue: true })).value;
  const formula = mergedFollower ? '' : checkExcelize(file.GetCellFormula(sheet, axis)).formula;
  const styleId = checkExcelize(file.GetCellStyle(sheet, axis)).style;
  if (raw === '' && !formula && !styleId) return undefined;
  const type = checkExcelize(file.GetCellType(sheet, axis)).cellType;
  let value: ModelCellType['value'] = raw;
  if (type === api.CellTypeBool) value = raw === '1' || raw.toLowerCase() === 'true';
  else if ((type === api.CellTypeNumber || type === api.CellTypeUnset ||
    type === api.CellTypeDate || type === api.CellTypeFormula) && raw !== '' && Number.isFinite(Number(raw))) {
    value = Number(raw);
  }
  return {
    value,
    ...(styleId ? fromExcelizeStyle(checkExcelize(file.GetStyle(styleId)).style) : {}),
    ...(formula ? { formula: formula.startsWith(FORMULA_PREFIX) ? formula : FORMULA_PREFIX + formula } : {}),
  };
}

export function convertWorkbookToModel(file: NewFile, api: Excelize): ModelJSON {
  checkExcelize(file);
  const result = emptyModel();
  const names = file.GetSheetList().list;
  const nameToId = Object.fromEntries(names.map((name, index) => [name, String(index + 1)]));
  names.forEach((name, index) => {
    const sheetId = nameToId[name];
    const rows = checkExcelize(file.GetRows(name, { RawCellValue: true })).result;
    const dimension = checkExcelize(file.GetSheetDimension(name)).dimension;
    const end = coordinates(dimension.split(':').at(-1) || 'A1');
    const props = checkExcelize(file.GetSheetProps(name)).props;
    let rowCount = Math.max(DEFAULT_ROW_COUNT, rows.length, end.row + 1);
    let colCount = rows.reduce((count, row) => Math.max(count, row.length),
      Math.max(DEFAULT_COL_COUNT, end.col + 1));
    const merges = checkExcelize(file.GetMergeCells(name, true)).mergeCells;
    const mergedRanges: Array<{ row: number; col: number; endRow: number; endCol: number }> = [];
    for (const merge of merges) {
      const start = coordinates(merge.GetStartAxis());
      const finish = coordinates(merge.GetEndAxis());
      mergedRanges.push({ ...start, endRow: finish.row, endCol: finish.col });
      result.mergeCells[`${name}!${merge.GetStartAxis()}:${merge.GetEndAxis()}`] = {
        row: start.row, col: start.col, rowCount: finish.row - start.row + 1,
        colCount: finish.col - start.col + 1, sheetId,
      };
      rowCount = Math.max(rowCount, finish.row + 1);
      colCount = Math.max(colCount, finish.col + 1);
    }
    rowCount = Math.min(rowCount, XLSX_MAX_ROW_COUNT);
    colCount = Math.min(colCount, XLSX_MAX_COL_COUNT);
    result.workbook[sheetId] = {
      sheetId, name, sort: index, rowCount, colCount,
      isHide: !checkExcelize(file.GetSheetVisible(name)).visible,
      tabColor: props.TabColorRGB ? `#${props.TabColorRGB.slice(-6)}` : undefined,
    };
    for (let row = 0; row < rowCount; row++) {
      const height = checkExcelize(file.GetRowHeight(name, row + 1)).height;
      const visible = checkExcelize(file.GetRowVisible(name, row + 1)).visible;
      if (height !== (props.DefaultRowHeight || 15) || !visible) {
        result.customHeight[getCustomWidthOrHeightKey(sheetId, row)] = {
          len: Math.round(height * 96 / 72), isHide: !visible,
        };
      }
      const usedCols = Math.max(rows[row]?.length ?? 0, row <= end.row ? end.col + 1 : 0);
      for (let col = 0; col < Math.min(usedCols, colCount); col++) {
        const mergedFollower = mergedRanges.some((range) => row >= range.row && row <= range.endRow &&
          col >= range.col && col <= range.endCol && (row !== range.row || col !== range.col));
        const cell = readCell(file, api, name, `${intToColumnName(col)}${row + 1}`, mergedFollower);
        if (cell) result.worksheets[getWorksheetKey(sheetId, row, col)] = cell;
      }
    }
    for (let col = 0; col < colCount; col++) {
      const column = intToColumnName(col);
      const width = checkExcelize(file.GetColWidth(name, column)).width;
      const visible = checkExcelize(file.GetColVisible(name, column)).visible;
      if (width !== (props.DefaultColWidth || 9.140625) || !visible) {
        result.customWidth[getCustomWidthOrHeightKey(sheetId, col)] = {
          len: Math.round(width * 7), isHide: !visible,
        };
      }
    }
  });
  const active = checkExcelize(file.GetActiveSheetIndex()).index;
  result.currentSheetId = nameToId[names[active]] ?? nameToId[names[0]] ?? '';
  for (const item of checkExcelize(file.GetDefinedName()).definedNames) {
    if (!item.Name || !item.RefersTo) continue;
    const range = parseReference(item.RefersTo.replace(/^=/, ''), (name) => nameToId[name] || '');
    if (range) result.definedNames[item.Name.toLowerCase()] = range.toIRange();
  }
  return result;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let quoted = false;
  text = text.replace(/^\uFEFF/, '');
  for (let index = 0; index < text.length; index++) {
    const char = text[index];
    if (char === '"') {
      if (quoted && text[index + 1] === '"') { field += '"'; index++; }
      else quoted = !quoted;
    } else if (!quoted && (char === ',' || char === '\r' || char === '\n')) {
      row.push(field);
      field = '';
      if (char !== ',') {
        rows.push(row);
        row = [];
        if (char === '\r' && text[index + 1] === '\n') index++;
      }
    } else field += char;
  }
  if (quoted) throw new Error('Unclosed quoted CSV field');
  if (field || row.length) { row.push(field); rows.push(row); }
  return rows;
}

function importCsv(text: string): ModelJSON {
  const result = emptyModel();
  const rows = parseCsv(text);
  result.currentSheetId = '1';
  result.workbook['1'] = {
    sheetId: '1', name: 'Sheet1', isHide: false, sort: 0,
    rowCount: Math.max(DEFAULT_ROW_COUNT, rows.length),
    colCount: rows.reduce((count, row) => Math.max(count, row.length), DEFAULT_COL_COUNT),
  };
  rows.forEach((row, r) => row.forEach((raw, c) => {
    if (!raw) return;
    let value: ModelCellType['value'] = raw;
    if (/^(true|false)$/i.test(raw)) value = raw.toLowerCase() === 'true';
    else if (/^[+-]?(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw) && Number.isFinite(Number(raw))) value = Number(raw);
    result.worksheets[getWorksheetKey('1', r, c)] = { value };
  }));
  return result;
}

export async function importExcel(file: ExcelInput): Promise<ModelJSON> {
  if (typeof File !== 'undefined' && file instanceof File) {
    if (/\.csv$/i.test(file.name) || file.type === 'text/csv') {
      return importCsv(await convertFileToTextOrBase64(file, false));
    }
    if (!/\.(xlsx|xlsm|xlam|xltm|xltx)$/i.test(file.name)) {
      throw new Error(`Unsupported spreadsheet format: ${file.name}`);
    }
  }
  const bytes = await toUint8Array(file);
  const api = await loadExcelize();
  return convertWorkbookToModel(checkExcelize(api.OpenReader(bytes)), api);
}
