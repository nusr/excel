import { exportToCsv } from '../exportExcel';
import { initController } from '../../../controller';

describe('exportToCsv.test.ts', () => {
  describe('exportToCsv', () => {
    test('quotes delimiters, quotes, newlines, and surrounding whitespace', () => {
      const controller = initController();
      controller.addSheet();
      controller.setCell(
        [['中文,标题', '第一行\n第二行', '他说"你好"', '尾部 ']],
        [[{}, {}, {}, {}]],
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
      );
      expect(exportToCsv(controller)).toBe(
        '"中文,标题","第一行\n第二行","他说""你好""","尾部 "',
      );
    });

    test('uses CRLF records and trims unused trailing rows and columns', () => {
      const controller = initController();
      controller.addSheet();
      controller.setCell(
        [['a', '', 'b'], ['tail', '', '']],
        [[{}, {}, {}], [{}, {}, {}]],
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
      );
      expect(exportToCsv(controller)).toBe('a,,b\r\ntail');
    });

    test('prefixes formula-like text to prevent spreadsheet formula injection', () => {
      const controller = initController();
      controller.addSheet();
      controller.setCell(
        [['+SUM(A1:A2)', '-cmd', '@SUM(A1:A2)', '  =literal', -5]],
        [[{}, {}, {}, {}, {}]],
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
      );
      expect(exportToCsv(controller)).toBe(
        "'+SUM(A1:A2),'-cmd,'@SUM(A1:A2),'  =literal,-5",
      );
    });
  });
});
