import * as XLSX from 'xlsx';
import {
  ModelJSON,
  ModelCellType,
  WorksheetType,
  StyleType,
  BorderType,
  BorderItem,
  EHorizontalAlign,
  EVerticalAlign,
  EUnderLine,
} from '../../types';
import {
  getWorksheetKey,
  getCustomWidthOrHeightKey,
  parseReference,
  convertFileToTextOrBase64,
  FORMULA_PREFIX,
  CELL_WIDTH,
  CELL_HEIGHT,
  CSV_SPLITTER,
  XLSX_MAX_ROW_COUNT,
  XLSX_MAX_COL_COUNT,
  BORDER_TYPE_MAP,
} from '../../util';

// The Meza model defaults every imported sheet to this virtual grid size.
const DEFAULT_ROW_COUNT = 200;
const DEFAULT_COL_COUNT = 200;

type ExcelInput = File | Blob | ArrayBuffer | Uint8Array | ArrayLike<number>;

async function toUint8Array(file: ExcelInput): Promise<Uint8Array> {
  if (file && typeof (file as Blob).arrayBuffer === 'function') {
    return new Uint8Array(await (file as Blob).arrayBuffer());
  }
  if (file instanceof ArrayBuffer) {
    return new Uint8Array(file);
  }
  return new Uint8Array(file as ArrayLike<number>);
}

function rgbToHex(rgb?: string): string {
  if (!rgb || typeof rgb !== 'string') {
    return '';
  }
  let hex = rgb;
  if (hex.length === 8) {
    hex = hex.slice(2); // strip leading alpha (AARRGGBB -> RRGGBB)
  }
  if (hex.length === 6) {
    return `#${hex.toUpperCase()}`;
  }
  return '';
}

function getBorderItem(data: any): BorderItem | undefined {
  const type = data?.style;
  if (typeof type !== 'string' || !(type in BORDER_TYPE_MAP)) {
    return undefined;
  }
  return { type: type as BorderType, color: rgbToHex(data?.color?.rgb) };
}

function getFontStyle(font: any): Partial<StyleType> {
  const style: Partial<StyleType> = {};
  if (typeof font.sz === 'number') {
    style.fontSize = font.sz;
  }
  if (font.name) {
    style.fontFamily = String(font.name);
  }
  if (font.bold) {
    style.isBold = true;
  }
  if (font.italic) {
    style.isItalic = true;
  }
  if (font.strike) {
    style.isStrike = true;
  }
  if (font.underline) {
    style.underline = EUnderLine.SINGLE;
  }
  const fontColor = rgbToHex(font.color?.rgb);
  if (fontColor) {
    style.fontColor = fontColor;
  }
  return style;
}

const HORIZONTAL_ALIGN_MAP: Record<string, EHorizontalAlign> = {
  left: EHorizontalAlign.LEFT,
  center: EHorizontalAlign.CENTER,
  right: EHorizontalAlign.RIGHT,
};
const VERTICAL_ALIGN_MAP: Record<string, EVerticalAlign> = {
  top: EVerticalAlign.TOP,
  center: EVerticalAlign.MIDDLE,
  bottom: EVerticalAlign.BOTTOM,
};

function getAlignmentStyle(alignment: any): Partial<StyleType> {
  const style: Partial<StyleType> = {};
  if (alignment.horizontal in HORIZONTAL_ALIGN_MAP) {
    style.horizontalAlign = HORIZONTAL_ALIGN_MAP[alignment.horizontal];
  }
  if (alignment.vertical in VERTICAL_ALIGN_MAP) {
    style.verticalAlign = VERTICAL_ALIGN_MAP[alignment.vertical];
  }
  if (alignment.wrapText) {
    style.isWrapText = true;
  }
  return style;
}

function getBorderStyle(border: any): Partial<StyleType> {
  const style: Partial<StyleType> = {};
  const left = getBorderItem(border.left);
  const right = getBorderItem(border.right);
  const top = getBorderItem(border.top);
  const bottom = getBorderItem(border.bottom);
  if (left) {
    style.borderLeft = left;
  }
  if (right) {
    style.borderRight = right;
  }
  if (top) {
    style.borderTop = top;
  }
  if (bottom) {
    style.borderBottom = bottom;
  }
  return style;
}

function getCellStyle(cellStyle: any): Partial<StyleType> {
  if (!cellStyle || typeof cellStyle !== 'object') {
    return {};
  }
  const fill = cellStyle.fill || {};
  const fillColor =
    fill.patternType && fill.patternType !== 'none'
      ? rgbToHex(fill.fgColor?.rgb)
      : '';
  return {
    ...getFontStyle(cellStyle.font || {}),
    ...(fillColor ? { fillColor } : {}),
    ...getAlignmentStyle(cellStyle.alignment || {}),
    ...getBorderStyle(cellStyle.border || {}),
  };
}

function convertCell(cell: XLSX.CellObject): ModelCellType {
  let value: ModelCellType['value'];
  switch (cell.t) {
    case 'b':
      value = Boolean(cell.v);
      break;
    case 'n':
      value = typeof cell.v === 'number' ? cell.v : Number(cell.v ?? 0);
      break;
    case 'e':
      value = cell.w ?? String(cell.v ?? '');
      break;
    case 'z':
      value = '';
      break;
    default:
      value = cell.v == null ? '' : String(cell.v);
  }

  const result: ModelCellType = { value, ...getCellStyle(cell.s) };
  if (cell.f) {
    result.formula = cell.f.startsWith(FORMULA_PREFIX)
      ? cell.f
      : FORMULA_PREFIX + cell.f;
  }
  if (cell.z && cell.z !== 'General') {
    result.numberFormat = String(cell.z);
  }
  return result;
}

function readSheetCells(
  sheet: XLSX.WorkSheet,
  sheetId: string,
  info: WorksheetType,
  worksheets: ModelJSON['worksheets'],
): void {
  const ref = sheet['!ref'];
  if (!ref) {
    return;
  }
  const range = XLSX.utils.decode_range(ref);
  const endRow = Math.min(range.e.r, XLSX_MAX_ROW_COUNT - 1);
  const endCol = Math.min(range.e.c, XLSX_MAX_COL_COUNT - 1);
  info.rowCount = Math.max(info.rowCount, endRow + 1);
  info.colCount = Math.max(info.colCount, endCol + 1);
  for (let r = range.s.r; r <= endRow; r++) {
    for (let c = range.s.c; c <= endCol; c++) {
      const cell = sheet[XLSX.utils.encode_cell({ r, c })] as
        | XLSX.CellObject
        | undefined;
      if (cell) {
        worksheets[getWorksheetKey(sheetId, r, c)] = convertCell(cell);
      }
    }
  }
}

function readSizes<T extends { hidden?: boolean }>(
  list: T[] | undefined,
  sheetId: string,
  target: ModelJSON['customWidth'],
  fallback: number,
  getLen: (item: T) => number | undefined,
): void {
  (list || []).forEach((item, index) => {
    if (!item) {
      return;
    }
    const len = getLen(item);
    if (len === undefined && !item.hidden) {
      return;
    }
    target[getCustomWidthOrHeightKey(sheetId, index)] = {
      len: len ?? fallback,
      isHide: Boolean(item.hidden),
    };
  });
}

function readSheetSizes(
  sheet: XLSX.WorkSheet,
  sheetId: string,
  result: ModelJSON,
): void {
  readSizes(sheet['!cols'], sheetId, result.customWidth, CELL_WIDTH, (col) => {
    if (typeof col.wpx === 'number') {
      return Math.round(col.wpx);
    }
    if (typeof col.wch === 'number') {
      return Math.round(col.wch * 7);
    }
    return undefined;
  });
  readSizes(
    sheet['!rows'],
    sheetId,
    result.customHeight,
    CELL_HEIGHT,
    (row) => {
      if (typeof row.hpx === 'number') {
        return Math.round(row.hpx);
      }
      if (typeof row.hpt === 'number') {
        return Math.round((row.hpt * 96) / 72);
      }
      return undefined;
    },
  );
}

export function convertWorkbookToModel(workbook: XLSX.WorkBook): ModelJSON {
  const result: ModelJSON = {
    workbook: {},
    mergeCells: {},
    customHeight: {},
    customWidth: {},
    definedNames: {},
    currentSheetId: '',
    drawings: {},
    rangeMap: {},
    worksheets: {},
    autoFilter: {},
    scroll: {},
  };

  const sheetProps = workbook.Workbook?.Sheets || [];
  const nameToSheetId: Record<string, string> = {};

  workbook.SheetNames.forEach((name, index) => {
    const sheetId = String(index + 1);
    nameToSheetId[name] = sheetId;
    const sheet = workbook.Sheets[name];
    const info: WorksheetType = {
      sheetId,
      name,
      isHide: Boolean(sheetProps[index]?.Hidden),
      rowCount: DEFAULT_ROW_COUNT,
      colCount: DEFAULT_COL_COUNT,
      sort: index,
      tabColor: undefined,
    };
    if (sheet) {
      readSheetCells(sheet, sheetId, info, result.worksheets);
      for (const merge of sheet['!merges'] || []) {
        result.mergeCells[`${name}!${XLSX.utils.encode_range(merge)}`] = {
          row: merge.s.r,
          col: merge.s.c,
          rowCount: merge.e.r - merge.s.r + 1,
          colCount: merge.e.c - merge.s.c + 1,
          sheetId,
        };
      }
      readSheetSizes(sheet, sheetId, result);
    }
    result.workbook[sheetId] = info;
  });

  result.currentSheetId = workbook.SheetNames.length
    ? nameToSheetId[workbook.SheetNames[0]]
    : '';

  for (const item of workbook.Workbook?.Names || []) {
    if (!item?.Name || !item.Ref) {
      continue;
    }
    const range = parseReference(item.Ref, (name) => nameToSheetId[name] || '');
    if (range) {
      result.definedNames[item.Name.toLowerCase()] = range.toIRange();
    }
  }

  return result;
}

function isCsvFile(file: ExcelInput): file is File {
  return (
    typeof File !== 'undefined' &&
    file instanceof File &&
    (/\.csv$/i.test(file.name) || file.type === 'text/csv')
  );
}

export async function importExcel(file: ExcelInput): Promise<ModelJSON> {
  const workbook = isCsvFile(file)
    ? XLSX.read(await convertFileToTextOrBase64(file, false), {
        type: 'string',
        FS: CSV_SPLITTER,
      })
    : XLSX.read(await toUint8Array(file), {
        type: 'array',
        cellFormula: true,
        cellNF: true,
        cellStyles: true,
        cellDates: false,
      });
  return convertWorkbookToModel(workbook);
}
