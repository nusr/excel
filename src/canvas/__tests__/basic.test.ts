import { initController } from '@/controller';
import { EUnderLine, IController } from '@/types';
import { snapshot } from './util';

describe('basic.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await snapshot(controller);
  });
  describe('cell value', () => {
    test('value', async () => {
      controller.setCell([[1]], [], {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      });
    });
    test('style', async () => {
      controller.setCell(
        [[1]],
        [
          [
            {
              fontColor: 'red',
              isBold: true,
              isItalic: true,
              isStrike: true,
              underline: EUnderLine.SINGLE,
            },
          ],
        ],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        },
      );
    });
    test('fill color', async () => {
      controller.setCell(
        [[1]],
        [
          [
            {
              fillColor: 'red',
            },
          ],
        ],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        },
      );
    });
  });
});
