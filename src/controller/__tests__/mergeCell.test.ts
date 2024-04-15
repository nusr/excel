import { Controller } from '..';
import { Model } from '@/model';
import { EHorizontalAlign, EMergeCellType } from '@/types';
import { HTML_FORMAT, MERGE_CELL_LINE_BREAK, PLAIN_FORMAT } from '@/util';

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
  describe('addMergeCell', () => {
    test('ok', () => {
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
    test('merge and center', () => {
      controller.setCell(
        [
          [1, 2],
          [4, 5],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 0,
          colCount: 0,
          sheetId: controller.getCurrentSheetId(),
        },
      );
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
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        }),
      ).toEqual({
        value: 1,
        style: {
          horizontalAlign: EHorizontalAlign.CENTER,
        },
      });
    });
    test('merge content', () => {
      controller.setCell(
        [
          [1, 2],
          [3, 4],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 0,
          colCount: 0,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      controller.addMergeCell(
        {
          row: 0,
          col: 0,
          rowCount: 2,
          colCount: 2,
          sheetId: controller.getCurrentSheetId(),
        },
        EMergeCellType.MERGE_CONTENT,
      );
      expect(
        controller.getMergeCellList(controller.getCurrentSheetId()),
      ).toHaveLength(1);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        }),
      ).toEqual({
        value: [1, 2, 3, 4].join(MERGE_CELL_LINE_BREAK),
        style: { isWrapText: true },
      });
    });
  });
  describe('deleteMergeCell', () => {
    test('ok', () => {
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
      controller.deleteMergeCell({
        row: 0,
        col: 0,
        rowCount: 2,
        colCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getMergeCellList(controller.getCurrentSheetId()),
      ).toHaveLength(0);
    });
  });
  describe('undo redo', () => {
    test('undo', () => {
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
      expect(controller.canUndo()).toEqual(true);

      controller.undo();
      expect(
        controller.getMergeCellList(controller.getCurrentSheetId()),
      ).toHaveLength(0);
      expect(controller.canRedo()).toEqual(true);
      controller.redo();
      expect(
        controller.getMergeCellList(controller.getCurrentSheetId()),
      ).toHaveLength(1);
    });
  });
});
