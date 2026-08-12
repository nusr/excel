import * as XLSX from 'xlsx';
import { convertWorkbookToModel } from '../importExcel';
import {
  getWorksheetKey,
  getCustomWidthOrHeightKey,
  CELL_WIDTH,
  CELL_HEIGHT,
} from '../../../util';
import { EUnderLine, EHorizontalAlign, EVerticalAlign } from '../../../types';

function makeWorkbook(overrides: Partial<XLSX.WorkBook>): XLSX.WorkBook {
  return {
    SheetNames: [],
    Sheets: {},
    ...overrides,
  } as XLSX.WorkBook;
}

describe('convertWorkbookToModel.test.ts', () => {
  test('parses every cell type', () => {
    const sheet: XLSX.WorkSheet = {
      '!ref': 'A1:A6',
      A1: { t: 'b', v: true } as XLSX.CellObject,
      A2: { t: 'n', v: 42 } as XLSX.CellObject,
      // number type but non-number value -> Number() coercion
      A3: { t: 'n', v: '7' as unknown as number } as XLSX.CellObject,
      // error type with display text
      A4: { t: 'e', v: 0x07, w: '#DIV/0!' } as XLSX.CellObject,
      // blank type
      A5: { t: 'z' } as XLSX.CellObject,
      // string type
      A6: { t: 's', v: 'hello' } as XLSX.CellObject,
    };
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: { Sheet1: sheet },
    });
    const model = convertWorkbookToModel(workbook);
    const id = '1';
    expect(model.worksheets[getWorksheetKey(id, 0, 0)].value).toBe(true);
    expect(model.worksheets[getWorksheetKey(id, 1, 0)].value).toBe(42);
    expect(model.worksheets[getWorksheetKey(id, 2, 0)].value).toBe(7);
    expect(model.worksheets[getWorksheetKey(id, 3, 0)].value).toBe('#DIV/0!');
    expect(model.worksheets[getWorksheetKey(id, 4, 0)].value).toBe('');
    expect(model.worksheets[getWorksheetKey(id, 5, 0)].value).toBe('hello');
  });

  test('error cell without display text falls back to string value', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A2',
          A1: { t: 'e', v: 42 } as XLSX.CellObject,
          A2: { t: 's', v: null } as unknown as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('42');
    // string cell with null value becomes empty string
    expect(model.worksheets[getWorksheetKey('1', 1, 0)].value).toBe('');
  });

  test('parses number type with nullish value as 0', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A1',
          A1: { t: 'n' } as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe(0);
  });

  test('parses formulas with and without leading =', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A2',
          A1: { t: 'n', v: 3, f: 'SUM(A2,B2)' } as XLSX.CellObject,
          A2: { t: 'n', v: 3, f: '=SUM(A3,B3)' } as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].formula).toBe(
      '=SUM(A2,B2)',
    );
    expect(model.worksheets[getWorksheetKey('1', 1, 0)].formula).toBe(
      '=SUM(A3,B3)',
    );
  });

  test('keeps custom number format but drops General', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A2',
          A1: { t: 'n', v: 0.5, z: '0.00%' } as XLSX.CellObject,
          A2: { t: 'n', v: 1, z: 'General' } as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].numberFormat).toBe(
      '0.00%',
    );
    expect(
      model.worksheets[getWorksheetKey('1', 1, 0)].numberFormat,
    ).toBeUndefined();
  });

  test('parses font, fill, alignment and border styles', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A1',
          A1: {
            t: 's',
            v: 'styled',
            s: {
              font: {
                sz: 18,
                name: 'Arial',
                bold: true,
                italic: true,
                strike: true,
                underline: true,
                color: { rgb: 'FF00FF00' }, // 8-char with alpha
              },
              fill: { patternType: 'solid', fgColor: { rgb: 'FFFF00' } },
              alignment: {
                horizontal: 'center',
                vertical: 'center',
                wrapText: true,
              },
              border: {
                left: { style: 'thin', color: { rgb: '000000' } },
                right: { style: 'medium' },
                top: { style: 'thick', color: { rgb: 'FF0000' } },
                bottom: { style: 'double' },
              },
            },
          } as unknown as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    const cell = model.worksheets[getWorksheetKey('1', 0, 0)];
    expect(cell).toMatchObject({
      value: 'styled',
      fontSize: 18,
      fontFamily: 'Arial',
      isBold: true,
      isItalic: true,
      isStrike: true,
      underline: EUnderLine.SINGLE,
      fontColor: '#00FF00',
      fillColor: '#FFFF00',
      horizontalAlign: EHorizontalAlign.CENTER,
      verticalAlign: EVerticalAlign.MIDDLE,
      isWrapText: true,
    });
    expect(cell.borderLeft).toEqual({ type: 'thin', color: '#000000' });
    expect(cell.borderRight).toEqual({ type: 'medium', color: '' });
    expect(cell.borderTop).toEqual({ type: 'thick', color: '#FF0000' });
    expect(cell.borderBottom).toEqual({ type: 'double', color: '' });
  });

  test('handles left/right horizontal and top/bottom vertical alignment', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A2',
          A1: {
            t: 's',
            v: 'a',
            s: { alignment: { horizontal: 'left', vertical: 'top' } },
          } as unknown as XLSX.CellObject,
          A2: {
            t: 's',
            v: 'b',
            s: { alignment: { horizontal: 'right', vertical: 'bottom' } },
          } as unknown as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)]).toMatchObject({
      horizontalAlign: EHorizontalAlign.LEFT,
      verticalAlign: EVerticalAlign.TOP,
    });
    expect(model.worksheets[getWorksheetKey('1', 1, 0)]).toMatchObject({
      horizontalAlign: EHorizontalAlign.RIGHT,
      verticalAlign: EVerticalAlign.BOTTOM,
    });
  });

  test('ignores invalid colors, borders and none fill pattern', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A1',
          A1: {
            t: 's',
            v: 'x',
            s: {
              font: { color: { rgb: 'ABC' } }, // invalid length -> no color
              fill: { patternType: 'none', fgColor: { rgb: 'FFFFFF' } },
              border: {
                left: {}, // no style -> skipped
                right: { style: 'unknown-style' }, // not in map -> skipped
              },
            },
          } as unknown as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    const cell = model.worksheets[getWorksheetKey('1', 0, 0)];
    expect(cell.fontColor).toBeUndefined();
    expect(cell.fillColor).toBeUndefined();
    expect(cell.borderLeft).toBeUndefined();
    expect(cell.borderRight).toBeUndefined();
  });

  test('cell with non-object style is untouched', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A1',
          A1: { t: 's', v: 'x', s: 'bogus' } as unknown as XLSX.CellObject,
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)]).toEqual({
      value: 'x',
    });
  });

  test('reads column and row sizes from wpx/wch and hpx/hpt', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:A1',
          A1: { t: 's', v: 'x' } as XLSX.CellObject,
          '!cols': [
            { wpx: 120 },
            { wch: 10 },
            { hidden: true }, // no width but hidden -> fallback width
            {}, // no width, not hidden -> skipped
            null as unknown as XLSX.ColInfo, // null entry -> skipped
          ],
          '!rows': [{ hpx: 40 }, { hpt: 72 }, { hidden: true }],
        },
      },
    });
    const model = convertWorkbookToModel(workbook);
    const id = '1';
    expect(model.customWidth[getCustomWidthOrHeightKey(id, 0)]).toEqual({
      len: 120,
      isHide: false,
    });
    expect(model.customWidth[getCustomWidthOrHeightKey(id, 1)]).toEqual({
      len: 70,
      isHide: false,
    });
    expect(model.customWidth[getCustomWidthOrHeightKey(id, 2)]).toEqual({
      len: CELL_WIDTH,
      isHide: true,
    });
    expect(
      model.customWidth[getCustomWidthOrHeightKey(id, 3)],
    ).toBeUndefined();

    expect(model.customHeight[getCustomWidthOrHeightKey(id, 0)]).toEqual({
      len: 40,
      isHide: false,
    });
    expect(model.customHeight[getCustomWidthOrHeightKey(id, 1)]).toEqual({
      len: 96,
      isHide: false,
    });
    expect(model.customHeight[getCustomWidthOrHeightKey(id, 2)]).toEqual({
      len: CELL_HEIGHT,
      isHide: true,
    });
  });

  test('reads merges and marks hidden sheets', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1', 'Secret'],
      Sheets: {
        Sheet1: {
          '!ref': 'A1:B2',
          A1: { t: 's', v: 'x' } as XLSX.CellObject,
          '!merges': [{ s: { r: 0, c: 0 }, e: { r: 1, c: 1 } }],
        },
        Secret: { '!ref': 'A1:A1', A1: { t: 's', v: 'y' } as XLSX.CellObject },
      },
      Workbook: {
        Sheets: [{ Hidden: 0 }, { Hidden: 1 }],
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.workbook['1'].isHide).toBe(false);
    expect(model.workbook['2'].isHide).toBe(true);
    const merge = Object.values(model.mergeCells)[0];
    expect(merge).toMatchObject({
      row: 0,
      col: 0,
      rowCount: 2,
      colCount: 2,
      sheetId: '1',
    });
  });

  test('skips sheets without a ref and missing sheet entries', () => {
    const workbook = makeWorkbook({
      SheetNames: ['NoRef', 'Missing'],
      Sheets: {
        NoRef: {}, // no '!ref' -> readSheetCells returns early
        // 'Missing' has no Sheets entry
      } as XLSX.WorkBook['Sheets'],
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.workbook['1']).toBeDefined();
    expect(model.workbook['2']).toBeDefined();
    expect(Object.keys(model.worksheets)).toHaveLength(0);
  });

  test('parses defined names and skips invalid ones', () => {
    const workbook = makeWorkbook({
      SheetNames: ['Sheet1'],
      Sheets: {
        Sheet1: { '!ref': 'A1:A1', A1: { t: 's', v: 'x' } as XLSX.CellObject },
      },
      Workbook: {
        Names: [
          { Name: 'Foo', Ref: 'Sheet1!$A$1' },
          { Name: '', Ref: 'Sheet1!$A$1' }, // missing name -> skipped
          { Name: 'Bar', Ref: '' } as XLSX.DefinedName, // missing ref -> skipped
          { Name: 'Baz', Ref: 'not-a-reference' }, // unparseable -> skipped
        ],
      },
    });
    const model = convertWorkbookToModel(workbook);
    expect(model.definedNames.foo).toBeDefined();
    expect(model.definedNames.bar).toBeUndefined();
    expect(model.definedNames.baz).toBeUndefined();
  });

  test('empty workbook yields empty currentSheetId', () => {
    const model = convertWorkbookToModel(makeWorkbook({}));
    expect(model.currentSheetId).toBe('');
    expect(Object.keys(model.workbook)).toHaveLength(0);
  });
});
