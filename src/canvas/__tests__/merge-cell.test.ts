import { initController } from '@/controller';
import { IController, EMergeCellType } from '@/types';
import { snapshot } from './util';

describe('range.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
  });
  afterEach(async () => {
    await snapshot(controller);
  });

  test('merge center', async () => {
    controller.setCell(
      [
        [1, false],
        ['test', true],
      ],
      [],
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
      EMergeCellType.MERGE_CENTER,
    );
  });
  test('merge cell', async () => {
    controller.setCell(
      [
        [false, 1],
        ['test', true],
      ],
      [],
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
      EMergeCellType.MERGE_CELL,
    );
  });
  test.skip('merge content', async () => {
    controller.setCell(
      [
        [1, false],
        ['test', true],
      ],
      [],
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
