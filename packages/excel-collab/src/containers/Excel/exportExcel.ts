import * as XLSX from 'xlsx';
import { IController, ModelCellType, ModelJSON } from '../../types';
import {
  saveAs,
  convertWorksheetKey,
  widthOrHeightKeyToData,
  convertToReference,
  FORMULA_PREFIX,
  CSV_SPLITTER,
  LINE_BREAK,
} from '../../util';
import { numberFormat } from '../../formula';

const TEXT_MIME = 'text/plain;charset=utf-8;';

type ExportFormat = { bookType: XLSX.BookType; mime: string };

export const EXPORT_FORMATS: Record<string, ExportFormat> = {
  xlsx: {
    bookType: 'xlsx',
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  },
  xlsm: {
    bookType: 'xlsm',
    mime: 'application/vnd.ms-excel.sheet.macroEnabled.12',
  },
  xlsb: {
    bookType: 'xlsb',
    mime: 'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
  },
  xls: { bookType: 'biff8', mime: 'application/vnd.ms-excel' },
  xla: { bookType: 'xla', mime: 'application/vnd.ms-excel' },
  xml: { bookType: 'xlml', mime: 'application/xml' },
  ods: {
    bookType: 'ods',
    mime: 'application/vnd.oasis.opendocument.spreadsheet',
  },
  fods: {
    bookType: 'fods',
    mime: 'application/vnd.oasis.opendocument.spreadsheet',
  },
  csv: { bookType: 'csv', mime: 'text/csv;charset=utf-8;' },
  txt: { bookType: 'txt', mime: TEXT_MIME },
  sylk: { bookType: 'sylk', mime: TEXT_MIME },
  slk: { bookType: 'slk', mime: TEXT_MIME },
  html: { bookType: 'html', mime: 'text/html;charset=utf-8;' },
  dif: { bookType: 'dif', mime: TEXT_MIME },
  rtf: { bookType: 'rtf', mime: 'application/rtf' },
  prn: { bookType: 'prn', mime: TEXT_MIME },
  eth: { bookType: 'eth', mime: TEXT_MIME },
  dbf: { bookType: 'dbf', mime: 'application/dbf' },
};

function buildCell(cell: ModelCellType): XLSX.CellObject | undefined {
  const { value, formula, numberFormat: numFmt } = cell;
  const isEmpty = value === '' || value === null || value === undefined;
  if (isEmpty && !formula) {
    return undefined;
  }

  const result = {} as XLSX.CellObject;
  if (typeof value === 'boolean') {
    result.t = 'b';
    result.v = value;
  } else if (typeof value === 'number') {
    result.t = 'n';
    result.v = value;
  } else {
    result.t = 's';
    result.v = isEmpty ? '' : String(value);
  }

  if (formula) {
    result.f = formula.startsWith(FORMULA_PREFIX)
      ? formula.slice(FORMULA_PREFIX.length)
      : formula;
  }
  if (numFmt && numFmt !== 'General') {
    result.z = numFmt;
  }
  return result;
}

type SheetCell = { row: number; col: number; cell: ModelCellType };

function groupCellsBySheet(
  worksheets: Record<string, ModelCellType>,
): Record<string, SheetCell[]> {
  const result: Record<string, SheetCell[]> = {};
  for (const [key, cell] of Object.entries(worksheets)) {
    const info = convertWorksheetKey(key);
    if (!info) {
      continue;
    }
    const list = result[info.sheetId] || (result[info.sheetId] = []);
    list.push({ row: info.row, col: info.col, cell });
  }
  return result;
}

function buildMerges(
  mergeCells: ModelJSON['mergeCells'],
  sheetId: string,
): XLSX.Range[] {
  const merges: XLSX.Range[] = [];
  for (const range of Object.values(mergeCells)) {
    if (range.sheetId !== sheetId) {
      continue;
    }
    merges.push({
      s: { r: range.row, c: range.col },
      e: {
        r: range.row + range.rowCount - 1,
        c: range.col + range.colCount - 1,
      },
    });
  }
  return merges;
}

function buildSizes<T>(
  sizeMap: Record<string, { len: number; isHide: boolean }>,
  sheetId: string,
  make: (len: number, isHide: boolean) => T,
): T[] {
  const list: T[] = [];
  for (const [key, item] of Object.entries(sizeMap)) {
    const { sheetId: id, rowOrCol } = widthOrHeightKeyToData(key);
    if (id !== sheetId || rowOrCol < 0 || !item) {
      continue;
    }
    list[rowOrCol] = make(item.len, item.isHide);
  }
  return list;
}

function buildWorksheet(
  model: ModelJSON,
  sheetId: string,
  cells: SheetCell[],
): XLSX.WorkSheet {
  const worksheet: XLSX.WorkSheet = {};
  let maxRow = 0;
  let maxCol = 0;
  for (const { row, col, cell } of cells) {
    const xlsxCell = buildCell(cell);
    if (!xlsxCell) {
      continue;
    }
    worksheet[XLSX.utils.encode_cell({ r: row, c: col })] = xlsxCell;
    maxRow = Math.max(maxRow, row);
    maxCol = Math.max(maxCol, col);
  }

  const merges = buildMerges(model.mergeCells, sheetId);
  if (merges.length > 0) {
    worksheet['!merges'] = merges;
    for (const merge of merges) {
      maxRow = Math.max(maxRow, merge.e.r);
      maxCol = Math.max(maxCol, merge.e.c);
    }
  }
  const cols = buildSizes<XLSX.ColInfo>(
    model.customWidth,
    sheetId,
    (len, isHide) => ({ wpx: len, hidden: isHide }),
  );
  if (cols.length > 0) {
    worksheet['!cols'] = cols;
    maxCol = Math.max(maxCol, cols.length - 1);
  }
  const rows = buildSizes<XLSX.RowInfo>(
    model.customHeight,
    sheetId,
    (len, isHide) => ({ hpx: len, hidden: isHide }),
  );
  if (rows.length > 0) {
    worksheet['!rows'] = rows;
    maxRow = Math.max(maxRow, rows.length - 1);
  }

  worksheet['!ref'] = XLSX.utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: maxRow, c: maxCol },
  });
  return worksheet;
}

export function convertToWorkbook(controller: IController): XLSX.WorkBook {
  const model = controller.toJSON();
  const sheets = Object.values(model.workbook).sort((a, b) => a.sort - b.sort);
  const sheetIdToName: Record<string, string> = {};
  for (const sheet of sheets) {
    sheetIdToName[sheet.sheetId] = sheet.name;
  }

  const cellsBySheet = groupCellsBySheet(model.worksheets);
  const workbook = XLSX.utils.book_new();
  for (const sheet of sheets) {
    const worksheet = buildWorksheet(
      model,
      sheet.sheetId,
      cellsBySheet[sheet.sheetId] || [],
    );
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.name);
  }

  workbook.Workbook = workbook.Workbook || {};
  workbook.Workbook.Sheets = sheets.map((sheet) => ({
    name: sheet.name,
    Hidden: sheet.isHide ? 1 : 0,
  }));

  const names: XLSX.DefinedName[] = [];
  for (const [name, range] of Object.entries(model.definedNames)) {
    names.push({
      Name: name,
      Ref: convertToReference(
        range,
        'absolute',
        (sheetId) => sheetIdToName[sheetId] || '',
      ),
    });
  }
  if (names.length > 0) {
    workbook.Workbook.Names = names;
  }

  return workbook;
}

export function convertToXLSXData(controller: IController): Uint8Array {
  const workbook = convertToWorkbook(controller);
  return XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
}

/**
 * Serialize the whole workbook to any SheetJS-supported format, returned as raw
 * bytes ready to be wrapped in a `Blob`.
 */
export function convertToData(
  controller: IController,
  bookType: XLSX.BookType,
): Uint8Array {
  const workbook = convertToWorkbook(controller);
  return XLSX.write(workbook, { bookType, type: 'array' });
}

/**
 * Serialize the current sheet to CSV text, using the grid's display formatting.
 */
export function exportToCsv(controller: IController): string {
  const currentSheetId = controller.getCurrentSheetId();
  const sheetInfo = controller.getSheetInfo(currentSheetId);
  if (!sheetInfo) {
    return '';
  }

  const rows: string[][] = [];
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
    rows.push(list);
  }

  // delete trailing empty rows
  while (rows.length > 0 && rows.at(-1)!.every((v) => v === '')) {
    rows.pop();
  }

  const sheet = XLSX.utils.aoa_to_sheet(rows);
  const csv = XLSX.utils.sheet_to_csv(sheet, {
    FS: CSV_SPLITTER,
    RS: LINE_BREAK,
  });
  return csv.endsWith(LINE_BREAK) ? csv.slice(0, -LINE_BREAK.length) : csv;
}

export type ExportExtension = keyof typeof EXPORT_FORMATS;

export const EXPORT_EXTENSIONS = Object.keys(
  EXPORT_FORMATS,
) as ExportExtension[];

export function exportExcel(
  fileName: string,
  controller: IController,
  ext: ExportExtension,
): void {
  const format = EXPORT_FORMATS[ext] ?? EXPORT_FORMATS.xlsx;
  const blob =
    ext === 'csv'
      ? new Blob([exportToCsv(controller)], { type: format.mime })
      : new Blob([convertToData(controller, format.bookType) as BlobPart], {
          type: format.mime,
        });
  saveAs(blob, `${fileName}.${ext}`);
}
