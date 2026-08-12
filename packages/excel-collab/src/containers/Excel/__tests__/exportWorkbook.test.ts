import {
  convertToWorkbook,
  convertToXLSXData,
  exportToCsv,
} from '../exportExcel';
import { importExcel } from '../importExcel';
import { initController } from '../../../controller';
import { getCustomWidthOrHeightKey } from '../../../util';

describe('exportWorkbook.test.ts', () => {
  test('exportToCsv returns empty string when there is no sheet', () => {
    const controller = initController();
    expect(exportToCsv(controller)).toBe('');
  });

  test('empty-valued cells are skipped when building the worksheet', () => {
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
    const workbook = convertToWorkbook(controller);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    expect(sheet.A1).toBeUndefined();
    expect(sheet.B1.v).toBe('keep');
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
    const model = await importExcel(convertToXLSXData(controller));
    const id = Object.keys(model.workbook)[0];
    expect(model.customHeight[getCustomWidthOrHeightKey(id, 2)]).toBeDefined();
  });
});
