import { initController } from '@/controller';
import { IController, EMergeCellType } from '@/types';
import { compareScreenShot } from './util';

describe('wrap-text.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await compareScreenShot(controller);
  });
  test('basic', () => {
    controller.setCell(
      [['This is a very long text that needs to be wrapped']],
      [
        [
          {
            isWrapText: true,
            fontSize: 8,
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
  test('merge content', async () => {
    controller.setCell(
      [
        [1, false],
        ['test', true],
      ],
      [
        [{ fontSize: 8 }, { fontSize: 8 }],
        [{ fontSize: 8 }, { fontSize: 8 }],
      ],
      {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: '',
      },
    );
    controller.addMergeCell(
      {
        row: 0,
        col: 0,
        rowCount: 2,
        colCount: 2,
        sheetId: '',
      },
      EMergeCellType.MERGE_CONTENT,
    );
  });
});
