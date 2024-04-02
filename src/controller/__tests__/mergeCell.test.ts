import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('mergeCell.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), {
      async copyOrCut() {
        return '';
      },
      async paste() {
        return {
          [HTML_FORMAT]: '',
          [PLAIN_FORMAT]: '',
        };
      },
    });
    controller.addSheet();
  });
  describe('mergeCell', () => {
    test('normal', () => {
      controller.addMergeCell({
        row: 0,
        col: 0,
        rowCount: 2,
        colCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getMergeCellList(controller.getCurrentSheetId()),
      ).toHaveLength(1);
    });
  });
});
