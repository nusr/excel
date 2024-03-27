import { exportToCsv } from '../exportCSV';
import { initController } from '@/controller';

describe('exportToCsv.test.ts', () => {
  describe('exportToCsv', () => {
    test('normal', () => {
      const controller = initController();
      controller.setCellValues(
        [
          [true, false, 'true', 'false'],
          [4, 5, 6],
        ],
        [],
        [{ row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' }],
      );
      expect(exportToCsv(controller)).toEqual(
        'TRUE,FALSE,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,,,,\n4,5,6,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      );
    });
  });
});
