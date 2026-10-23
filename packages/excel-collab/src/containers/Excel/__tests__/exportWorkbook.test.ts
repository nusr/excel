import { convertToWorkbook, convertToXLSXData, exportToCsv } from '../exportExcel';
import { importExcel } from '../importExcel';
import { initController } from '../../../controller';
import { getCustomWidthOrHeightKey } from '../../../util';

describe('exportWorkbook.test.ts', () => {
  test('exportToCsv returns empty string when there is no sheet', () => {
    const controller = initController();
    expect(exportToCsv(controller)).toBe('');
  });

  test('empty-valued cells are skipped when building the worksheet', async () => {
    const controller = initController();
    controller.addSheet();
    const sheetId = controller.getCurrentSheetId();
    controller.setCell([['', 'keep']], [[{}, {}]], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId,
    });
    const workbook = await convertToWorkbook(controller);
    expect(workbook.GetCellValue('Sheet1', 'A1').value).toBe('');
    expect(workbook.GetCellValue('Sheet1', 'B1').value).toBe('keep');
  });

  test('round trips custom row heights', async () => {
    const controller = initController();
    controller.addSheet();
    const sheetId = controller.getCurrentSheetId();
    controller.setCell([['x']], [[{}]], {
      row: 0,
      col: 0,
      rowCount: 1,
      colCount: 1,
      sheetId,
    });
    controller.setRowHeight(2, 60);
    const model = await importExcel(await convertToXLSXData(controller));
    const id = Object.keys(model.workbook)[0];
    expect(model.customHeight[getCustomWidthOrHeightKey(id, 2)]).toBeDefined();
  });

  test('exports a deleted defined-name target as #REF! rather than an invalid cell address', async () => {
    const controller = initController();
    try {
      controller.addSheet();
      controller.setDefineName(
        {
          row: 1,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'deletedname',
      );
      controller.deleteRow(1, 1);
      expect(controller.toJSON().definedNames.deletedname).toMatchObject({ row: -1, col: -1 });
      const workbook = await convertToWorkbook(controller);
      expect(workbook.GetDefinedName().definedNames).toContainEqual(
        expect.objectContaining({ Name: 'deletedname', RefersTo: '#REF!' }),
      );
    } finally {
      controller.destroy();
      controller.getHooks().doc.destroy();
    }
  });
});
