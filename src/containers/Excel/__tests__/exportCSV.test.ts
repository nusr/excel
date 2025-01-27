import { exportToCsv } from '../exportCSV';
import { initController } from '../../../controller';
import { getFormatCode } from '../../../util';

describe('exportToCsv.test.ts', () => {
  describe('exportToCsv', () => {
    test('normal', () => {
      const controller = initController();
      controller.addSheet();
      controller.setCell(
        [
          [true, false, 'true', 'false'],
          [4, 5, 6],
          [',', '\n', '\t', '"'],
          [',\n', ',\n', ',\t', ',"'],
          [',\n\t', ',"\n'],
          [',\n\t"'],
        ],
        [
          [],
          [
            { numberFormat: getFormatCode(0) },
            { numberFormat: getFormatCode(2) },
          ],
        ],
        { row: 0, col: 0, rowCount: 1, colCount: 1, sheetId: '' },
      );
      const text = exportToCsv(controller).split('\n');
      expect(text).toEqual([
        'TRUE,FALSE,TRUE,FALSE,,,,,,,,,,,,,,,,,,,,,,,,,,',
        '4,5.00,6,,,,,,,,,,,,,,,,,,,,,,,,,,,',
        '",",0,0,"""""",,,,,,,,,,,,,,,,,,,,,,,,,,',
        '",',
        '",",',
        '",",\t",",""""",,,,,,,,,,,,,,,,,,,,,,,,,,',
        '",',
        '\t",",""""',
        '",,,,,,,,,,,,,,,,,,,,,,,,,,,,',
        '",',
        '\t""""",,,,,,,,,,,,,,,,,,,,,,,,,,,,,',
      ]);
    });
  });
});
