import { unzipSync } from 'fflate';
import { convertToXLSXData, convertToData } from '../exportExcel';
import { importExcel } from '../importExcel';
import { initController } from '../../../controller';
import { getWorksheetKey, getCustomWidthOrHeightKey } from '../../../util';
import { EUnderLine, EHorizontalAlign, EVerticalAlign } from '../../../types';
describe('exportXLSX.test.ts', () => {
  test('round trip preserves values, formulas, number formats, merges, defined names and sheets', async () => {
    const controller = initController();
    controller.addSheet();
    const sheetId = controller.getCurrentSheetId();
    controller.setCell(
      [
        [1, 2, '=SUM(A1,B1)'],
        [true, 'hello', 0.5],
      ],
      [
        [{}, {}, {}],
        [{}, {}, { numberFormat: '0.00%' }],
      ],
      { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId },
    );
    controller.setColWidth(1, 120);
    controller.addMergeCell({
      row: 3,
      col: 0,
      rowCount: 2,
      colCount: 2,
      sheetId,
    });
    controller.setDefineName({ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId }, 'foo');
    controller.addSheet();
    controller.renameSheet('Second');

    const data = await convertToXLSXData(controller);
    const model = await importExcel(data);

    const sheets = Object.values(model.workbook).sort((a, b) => a.sort - b.sort);
    expect(sheets.map((v) => v.name)).toEqual(['Sheet1', 'Second']);
    const id = sheets[0].sheetId;

    expect(model.worksheets[getWorksheetKey(id, 0, 0)].value).toBe(1);
    expect(model.worksheets[getWorksheetKey(id, 0, 1)].value).toBe(2);
    expect(model.worksheets[getWorksheetKey(id, 0, 2)].formula).toBe('=SUM(A1,B1)');
    expect(model.worksheets[getWorksheetKey(id, 1, 0)].value).toBe(true);
    expect(model.worksheets[getWorksheetKey(id, 1, 1)].value).toBe('hello');

    const formatted = model.worksheets[getWorksheetKey(id, 1, 2)];
    expect(formatted.value).toBe(0.5);
    expect(formatted.numberFormat).toBe('0.00%');

    expect(model.customWidth[getCustomWidthOrHeightKey(id, 1)]).toBeDefined();

    const merges = Object.values(model.mergeCells);
    expect(merges).toHaveLength(1);
    expect(merges[0]).toMatchObject({
      row: 3,
      col: 0,
      rowCount: 2,
      colCount: 2,
      sheetId: id,
    });

    expect(model.definedNames.foo).toMatchObject({ row: 0, col: 0 });
  });

  test.each([
    ['xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml'],
    ['xlsm', 'application/vnd.ms-excel.sheet.macroEnabled.main+xml'],
    ['xlam', 'application/vnd.ms-excel.addin.macroEnabled.main+xml'],
    ['xltm', 'application/vnd.ms-excel.template.macroEnabled.main+xml'],
    ['xltx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.template.main+xml'],
  ] as const)('exports %s with a matching workbook content type', async (format, contentType) => {
    const controller = initController();
    controller.addSheet();
    const sheetId = controller.getCurrentSheetId();
    controller.setCell([[42, 'hello']], [[{}, {}]], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId,
    });

    const data = await convertToData(controller, format);
    const files = unzipSync(data);
    const manifest = new TextDecoder().decode(files['[Content_Types].xml']);
    expect(manifest).toContain(`ContentType="${contentType}"`);
    const model = await importExcel(data);
    expect(model.worksheets[getWorksheetKey('1', 0, 0)].value).toBe(42);
  });

  test.each(['xlsb', 'xls', 'ods', 'html', 'dbf'] as const)(
    'rejects unsupported export format %s',
    async (format) => {
      await expect(convertToData(initController(), format)).rejects.toThrow(
        'Unsupported export format',
      );
    },
  );

  test('round trips cell styles, style-only cells and hidden custom sizes', async () => {
    const controller = initController();
    controller.addSheet();
    const sheetId = controller.getCurrentSheetId();
    const style = {
      fontSize: 18,
      fontFamily: 'Arial',
      fontColor: '#112233',
      fillColor: '#AABBCC',
      isBold: true,
      isItalic: true,
      isStrike: true,
      isWrapText: true,
      underline: EUnderLine.DOUBLE,
      horizontalAlign: EHorizontalAlign.RIGHT,
      verticalAlign: EVerticalAlign.TOP,
      borderBottom: { type: 'double' as const, color: '#445566' },
    };
    controller.setCell([['styled', '']], [[style, { fillColor: '#FFFFFF' }]], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 2,
      sheetId,
    });
    controller.setColWidth(1, 120);
    controller.setRowHeight(2, 60);
    controller.hideCol(1, 1);
    controller.hideRow(2, 1);
    const model = await importExcel(await convertToXLSXData(controller));
    expect(model.worksheets[getWorksheetKey('1', 0, 0)]).toMatchObject(style);
    expect(model.worksheets[getWorksheetKey('1', 0, 1)]).toMatchObject({
      value: '',
      fillColor: '#FFFFFF',
    });
    expect(model.customWidth[getCustomWidthOrHeightKey('1', 1)]).toEqual({
      len: 120,
      isHide: true,
    });
    expect(model.customHeight[getCustomWidthOrHeightKey('1', 2)]).toEqual({
      len: 60,
      isHide: true,
    });
  });
});
