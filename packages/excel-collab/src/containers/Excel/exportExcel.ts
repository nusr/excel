import type { NewFile } from 'excelize-wasm';
import { unzipSync, zipSync } from 'fflate';
import type { IController, ModelCellType } from '../../types';
import {
  saveAs,
  convertWorksheetKey,
  widthOrHeightKeyToData,
  convertToReference,
  intToColumnName,
  FORMULA_PREFIX,
  CSV_SPLITTER,
} from '../../util';
import { numberFormat } from '../../formula';
import { loadExcelize, checkExcelize } from './excelize';
import { toExcelizeStyle } from './excelizeStyle';

export const EXPORT_FORMATS = {
  xlsx: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    workbookContentType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml',
  },
  xlsm: {
    mime: 'application/vnd.ms-excel.sheet.macroEnabled.12',
    workbookContentType: 'application/vnd.ms-excel.sheet.macroEnabled.main+xml',
  },
  xlam: {
    mime: 'application/vnd.ms-excel.addin.macroEnabled.12',
    workbookContentType: 'application/vnd.ms-excel.addin.macroEnabled.main+xml',
  },
  xltm: {
    mime: 'application/vnd.ms-excel.template.macroEnabled.12',
    workbookContentType: 'application/vnd.ms-excel.template.macroEnabled.main+xml',
  },
  xltx: {
    mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.template',
    workbookContentType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml',
  },
  csv: { mime: 'text/csv;charset=utf-8;' },
};
export type ExportExtension = keyof typeof EXPORT_FORMATS;
export const EXPORT_EXTENSIONS = Object.keys(EXPORT_FORMATS) as ExportExtension[];

export async function convertToWorkbook(controller: IController): Promise<NewFile> {
  const api = await loadExcelize();
  const file = checkExcelize(api.NewFile());
  const model = controller.toJSON();
  const sheets = Object.values(model.workbook).sort((a, b) => a.sort - b.sort);
  if (!sheets.length) throw new Error('A workbook must contain at least one sheet');
  const defaultSheet = file.GetSheetList().list[0];
  const names = Object.fromEntries(sheets.map((sheet) => [sheet.sheetId, sheet.name]));
  // Temporary names avoid collisions with Excelize's initial Sheet1.
  const temporary = new Set(sheets.map((sheet) => sheet.name));
  let staging = '__excelize_initial__';
  while (temporary.has(staging)) staging += '_';
  checkExcelize(file.SetSheetName(defaultSheet, staging));
  for (const sheet of sheets) checkExcelize(file.NewSheet(sheet.name));
  checkExcelize(file.DeleteSheet(staging));
  const styles = new Map<string, number>();
  const bounds = new Map(sheets.map((sheet) => [sheet.sheetId, { row: 0, col: 0 }]));
  const grow = (sheetId: string, row: number, col: number) => {
    const size = bounds.get(sheetId);
    if (size) {
      size.row = Math.max(size.row, row);
      size.col = Math.max(size.col, col);
    }
  };
  for (const [key, cell] of Object.entries(model.worksheets)) {
    const location = convertWorksheetKey(key);
    if (!location || !names[location.sheetId]) continue;
    const { row, col, sheetId } = location;
    const sheet = names[sheetId];
    const axis = `${intToColumnName(col)}${row + 1}`;
    const style = toExcelizeStyle(cell);
    if (cell.value === '' && !cell.formula && !Object.keys(style).length) continue;
    checkExcelize(file.SetCellValue(sheet, axis, cell.value ?? ''));
    if (cell.formula) {
      checkExcelize(
        file.SetCellFormula(
          sheet,
          axis,
          cell.formula.startsWith(FORMULA_PREFIX) ? cell.formula : FORMULA_PREFIX + cell.formula,
        ),
      );
    }
    if (Object.keys(style).length) {
      const serialized = JSON.stringify(style);
      let id = styles.get(serialized);
      if (id === undefined) {
        id = checkExcelize(file.NewStyle(style)).style;
        styles.set(serialized, id);
      }
      checkExcelize(file.SetCellStyle(sheet, axis, axis, id));
    }
    grow(sheetId, row, col);
  }
  for (const range of Object.values(model.mergeCells)) {
    const name = names[range.sheetId];
    if (!name) continue;
    const endRow = range.row + range.rowCount - 1;
    const endCol = range.col + range.colCount - 1;
    checkExcelize(
      file.MergeCell(
        name,
        `${intToColumnName(range.col)}${range.row + 1}`,
        `${intToColumnName(endCol)}${endRow + 1}`,
      ),
    );
    grow(range.sheetId, endRow, endCol);
  }
  for (const [key, size] of Object.entries(model.customWidth)) {
    const { sheetId, rowOrCol } = widthOrHeightKeyToData(key);
    if (!names[sheetId] || rowOrCol < 0) continue;
    const column = intToColumnName(rowOrCol);
    checkExcelize(file.SetColWidth(names[sheetId], column, column, size.len / 7));
    checkExcelize(file.SetColVisible(names[sheetId], column, !size.isHide));
    grow(sheetId, 0, rowOrCol);
  }
  for (const [key, size] of Object.entries(model.customHeight)) {
    const { sheetId, rowOrCol } = widthOrHeightKeyToData(key);
    if (!names[sheetId] || rowOrCol < 0) continue;
    checkExcelize(file.SetRowHeight(names[sheetId], rowOrCol + 1, (size.len * 72) / 96));
    checkExcelize(file.SetRowVisible(names[sheetId], rowOrCol + 1, !size.isHide));
    grow(sheetId, rowOrCol, 0);
  }
  for (const sheet of sheets) {
    const size = bounds.get(sheet.sheetId)!;
    checkExcelize(
      file.SetSheetDimension(sheet.name, `A1:${intToColumnName(size.col)}${size.row + 1}`),
    );
    if (sheet.tabColor)
      checkExcelize(
        file.SetSheetProps(sheet.name, { TabColorRGB: sheet.tabColor.replace(/^#/, '') }),
      );
  }
  const activeIndex = sheets.findIndex(
    (sheet) => sheet.sheetId === model.currentSheetId && !sheet.isHide,
  );
  checkExcelize(
    file.SetActiveSheet(
      activeIndex >= 0
        ? activeIndex
        : Math.max(
            0,
            sheets.findIndex((sheet) => !sheet.isHide),
          ),
    ),
  );
  for (const sheet of sheets) checkExcelize(file.SetSheetVisible(sheet.name, !sheet.isHide));
  for (const [name, range] of Object.entries(model.definedNames)) {
    checkExcelize(
      file.SetDefinedName({
        Name: name,
        RefersTo: convertToReference(range, 'absolute', (id) => names[id] ?? ''),
      }),
    );
  }
  return file;
}

export async function convertToXLSXData(controller: IController): Promise<Uint8Array> {
  const file = await convertToWorkbook(controller);
  const { buffer } = checkExcelize(file.WriteToBuffer());
  if (ArrayBuffer.isView(buffer)) {
    return Uint8Array.from(new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength));
  }
  if (buffer instanceof ArrayBuffer) return new Uint8Array(buffer);
  throw new TypeError('Excelize returned an unsupported workbook buffer');
}

function convertWorkbookContentType(data: Uint8Array, contentType: string): Uint8Array {
  const files = unzipSync(data);
  const contentTypes = files['[Content_Types].xml'];
  if (!contentTypes) throw new Error('Excelize returned an invalid workbook');

  const xml = new TextDecoder().decode(contentTypes);
  let updated = false;
  const updatedXml = xml.replace(/<Override\b[^>]*>(?:<\/Override>)?/g, (tag) => {
    if (!/\bPartName="\/xl\/workbook\.xml"/.test(tag)) return tag;
    updated = true;
    return tag.replace(/\bContentType="[^"]+"/, `ContentType="${contentType}"`);
  });
  if (!updated) throw new Error('Excelize returned a workbook without a content type');

  files['[Content_Types].xml'] = new TextEncoder().encode(updatedXml);
  return zipSync(files);
}

export async function convertToData(controller: IController, format: string): Promise<Uint8Array> {
  if (!Object.hasOwn(EXPORT_FORMATS, format)) {
    throw new Error(`Unsupported export format: ${format}`);
  }
  if (format === 'csv') {
    return new TextEncoder().encode(`\uFEFF${exportToCsv(controller)}`);
  }
  const data = await convertToXLSXData(controller);
  if (format === 'xlsx') return data;
  const contentType = EXPORT_FORMATS[format as Exclude<ExportExtension, 'csv'>].workbookContentType;
  return convertWorkbookContentType(data, contentType);
}

export function exportToCsv(controller: IController): string {
  const sheetId = controller.getCurrentSheetId();
  const sheet = controller.getSheetInfo(sheetId);
  if (!sheet) return '';
  const rows: string[][] = [];
  for (let row = 0; row < sheet.rowCount; row++) {
    const values: string[] = [];
    for (let col = 0; col < sheet.colCount; col++) {
      const cell: ModelCellType | undefined = controller.getCell({
        row,
        col,
        rowCount: 1,
        colCount: 1,
        sheetId,
      });
      const value = numberFormat(cell?.value, cell?.numberFormat);
      const safeValue =
        typeof cell?.value === 'string' && /^[\t\r\n ]*[=+\-@]/.test(value) ? `'${value}` : value;
      values.push(safeValue);
    }
    while (values.length && values.at(-1) === '') values.pop();
    rows.push(values);
  }
  while (rows.length && rows.at(-1)!.length === 0) rows.pop();
  return rows
    .map((row) =>
      row
        .map((value) =>
          /[",\r\n]|^\s|\s$/.test(value) ? `"${value.replaceAll('"', '""')}"` : value,
        )
        .join(CSV_SPLITTER),
    )
    .join('\r\n');
}

export async function exportExcel(
  fileName: string,
  controller: IController,
  ext: ExportExtension,
): Promise<void> {
  if (!Object.hasOwn(EXPORT_FORMATS, ext)) throw new Error(`Unsupported export format: ${ext}`);
  const data: BlobPart = (await convertToData(controller, ext)).slice().buffer;
  saveAs(new Blob([data], { type: EXPORT_FORMATS[ext].mime }), `${fileName}.${ext}`);
}
