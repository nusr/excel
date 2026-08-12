import { convertToXLSXData, convertToData } from '../exportExcel';
import { importExcel } from '../importExcel';
import { initController } from '../../../controller';
import { getWorksheetKey, getCustomWidthOrHeightKey } from '../../../util';
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
    controller.setDefineName(
      { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId },
      'foo',
    );
    controller.addSheet();
    controller.renameSheet('Second');

    const data = convertToXLSXData(controller);
    const model = await importExcel(data);

    const sheets = Object.values(model.workbook).sort((a, b) => a.sort - b.sort);
    expect(sheets.map((v) => v.name)).toEqual(['Sheet1', 'Second']);
    const id = sheets[0].sheetId;

    expect(model.worksheets[getWorksheetKey(id, 0, 0)].value).toBe(1);
    expect(model.worksheets[getWorksheetKey(id, 0, 1)].value).toBe(2);
    expect(model.worksheets[getWorksheetKey(id, 0, 2)].formula).toBe(
      '=SUM(A1,B1)',
    );
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

  test.each(['xlsb', 'xls', 'ods', 'html', 'dbf'] as const)(
    'round trips values through %s',
    async (bookType) => {
      const controller = initController();
      controller.addSheet();
      const sheetId = controller.getCurrentSheetId();
      controller.setCell(
        [[42, 'hello']],
        [[{}, {}]],
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId },
      );

      const data = convertToData(controller, bookType);
      const model = await importExcel(data);

      const cells = Object.values(model.worksheets);
      expect(cells.some((c) => String(c.value) === '42')).toBe(true);
      expect(cells.some((c) => c.value === 'hello')).toBe(true);
    },
  );
});
