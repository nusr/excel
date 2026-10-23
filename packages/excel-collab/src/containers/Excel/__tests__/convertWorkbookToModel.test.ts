import type { NewFile } from 'excelize-wasm';
import { convertWorkbookToModel } from '../importExcel';
import { loadExcelize, checkExcelize, type Excelize } from '../excelize';
import { getWorksheetKey, getCustomWidthOrHeightKey } from '../../../util';
import { EUnderLine, EHorizontalAlign, EVerticalAlign } from '../../../types';

describe('convertWorkbookToModel', () => {
  let api: Excelize;
  let file: NewFile;
  beforeEach(async () => {
    api = await loadExcelize();
    file = checkExcelize(api.NewFile());
  });

  test('preserves booleans, numbers, strings, errors and formula cached values', () => {
    const values = [true, 42, '007', '#DIV/0!', 'hello', 3];
    values.forEach((value, index) =>
      checkExcelize(file.SetCellValue('Sheet1', `A${index + 1}`, value)),
    );
    checkExcelize(file.SetCellFormula('Sheet1', 'A6', '=SUM(1,2)'));
    const model = convertWorkbookToModel(file, api);
    values.forEach((value, index) => {
      expect(model.worksheets[getWorksheetKey('1', index, 0)].value).toBe(value);
    });
    expect(model.worksheets[getWorksheetKey('1', 5, 0)].formula).toBe('=SUM(1,2)');
  });

  test('preserves formulas with no cached value', () => {
    checkExcelize(file.SetCellFormula('Sheet1', 'B2', '=SUM(1,2)'));
    const model = convertWorkbookToModel(file, api);
    expect(model.worksheets[getWorksheetKey('1', 1, 1)]).toMatchObject({
      value: '',
      formula: '=SUM(1,2)',
    });
  });

  test('imports fonts, fills, alignment, borders and custom number formats', () => {
    checkExcelize(file.SetCellValue('Sheet1', 'A1', 0.5));
    const style = checkExcelize(
      file.NewStyle({
        Font: {
          Size: 18,
          Family: 'Arial',
          Bold: true,
          Italic: true,
          Strike: true,
          Underline: 'double',
          Color: '00FF00',
        },
        Fill: { Type: 'pattern', Pattern: 1, Color: ['FFFF00'] },
        Alignment: { Horizontal: 'center', Vertical: 'center', WrapText: true },
        Border: [
          { Type: 'left', Style: 1, Color: '000000' },
          { Type: 'right', Style: 2, Color: '112233' },
          { Type: 'top', Style: 5, Color: 'FF0000' },
          { Type: 'bottom', Style: 6, Color: '445566' },
        ],
        CustomNumFmt: '0.00%',
      }),
    ).style;
    checkExcelize(file.SetCellStyle('Sheet1', 'A1', 'A1', style));
    const cell = convertWorkbookToModel(file, api).worksheets[getWorksheetKey('1', 0, 0)];
    expect(cell).toMatchObject({
      value: 0.5,
      fontSize: 18,
      fontFamily: 'Arial',
      isBold: true,
      isItalic: true,
      isStrike: true,
      underline: EUnderLine.DOUBLE,
      fontColor: '#00FF00',
      fillColor: '#FFFF00',
      horizontalAlign: EHorizontalAlign.CENTER,
      verticalAlign: EVerticalAlign.MIDDLE,
      isWrapText: true,
      numberFormat: '0.00%',
      borderLeft: { type: 'thin', color: '#000000' },
      borderRight: { type: 'medium', color: '#112233' },
      borderTop: { type: 'thick', color: '#FF0000' },
      borderBottom: { type: 'double', color: '#445566' },
    });
  });

  test('resolves built-in number formats and retains style-only cells', () => {
    const style = checkExcelize(file.NewStyle({ NumFmt: 10 })).style;
    checkExcelize(file.SetCellStyle('Sheet1', 'B2', 'B2', style));
    checkExcelize(file.SetSheetDimension('Sheet1', 'A1:B2'));
    const cell = convertWorkbookToModel(file, api).worksheets[getWorksheetKey('1', 1, 1)];
    expect(cell).toMatchObject({ value: '', numberFormat: '0.00%' });
  });

  test('preserves custom sizes and hidden rows and columns', () => {
    checkExcelize(file.SetColWidth('Sheet1', 'A', 'A', 120 / 7));
    checkExcelize(file.SetRowHeight('Sheet1', 3, 45));
    checkExcelize(file.SetColVisible('Sheet1', 'B', false));
    checkExcelize(file.SetRowVisible('Sheet1', 2, false));
    const model = convertWorkbookToModel(file, api);
    expect(model.customWidth[getCustomWidthOrHeightKey('1', 0)]).toEqual({
      len: 120,
      isHide: false,
    });
    expect(model.customHeight[getCustomWidthOrHeightKey('1', 2)]).toEqual({
      len: 60,
      isHide: false,
    });
    expect(model.customWidth[getCustomWidthOrHeightKey('1', 1)].isHide).toBe(true);
    expect(model.customHeight[getCustomWidthOrHeightKey('1', 1)].isHide).toBe(true);
  });

  test('preserves sheet order, visibility, tab color, active sheet, merges and names', () => {
    checkExcelize(file.NewSheet('Visible'));
    checkExcelize(file.SetActiveSheet(1));
    checkExcelize(file.SetSheetVisible('Sheet1', false));
    checkExcelize(file.SetSheetProps('Visible', { TabColorRGB: 'FF112233' }));
    checkExcelize(file.MergeCell('Visible', 'A2', 'C4'));
    checkExcelize(file.SetDefinedName({ Name: 'Foo', RefersTo: "'Visible'!$A$1" }));
    const model = convertWorkbookToModel(file, api);
    expect(model.currentSheetId).toBe('2');
    expect(model.workbook['1'].isHide).toBe(true);
    expect(model.workbook['2']).toMatchObject({ name: 'Visible', sort: 1, tabColor: '#112233' });
    expect(Object.values(model.mergeCells)).toEqual([
      { row: 1, col: 0, rowCount: 3, colCount: 3, sheetId: '2' },
    ]);
    expect(model.definedNames.foo).toMatchObject({ row: 0, col: 0, sheetId: '2' });
  });

  test('empty sheets retain virtual grid dimensions and no cells', () => {
    const model = convertWorkbookToModel(file, api);
    expect(model.workbook['1']).toMatchObject({ rowCount: 200, colCount: 200 });
    expect(Object.keys(model.worksheets)).toHaveLength(0);
  });

  test('surfaces Excelize errors', () => {
    expect(() => checkExcelize(file.GetCellValue('Missing', 'A1'))).toThrow();
  });

  test('does not duplicate merged cell values into covered cells', () => {
    checkExcelize(file.SetCellValue('Sheet1', 'A1', 'merged'));
    checkExcelize(file.MergeCell('Sheet1', 'A1', 'B2'));
    const model = convertWorkbookToModel(file, api);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe('merged');
    for (const [row, col] of [
      [0, 1],
      [1, 0],
      [1, 1],
    ]) {
      expect(model.worksheets[getWorksheetKey('1', row, col)]?.value ?? '').toBe('');
    }
  });
});
