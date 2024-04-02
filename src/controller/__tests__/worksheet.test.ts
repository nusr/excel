import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('worksheet.test.ts', () => {
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

  describe('cell value', () => {
    test('getCell', () => {
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
    });
    test('set value', () => {
      controller.setCell([[1]], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0 });
    });
    test('set formula', () => {
      controller.setCell([['=SUM(1,2)']], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ formula: '=SUM(1,2)', row: 0, col: 0, value: 3 });
    });
    test('undo redo', () => {
      controller.setCell([[1]], [], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0 });
      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0 });
    });
  });
  describe('cell style', () => {
    test('get', () => {
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
    });
    test('set', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0, style: { isBold: true } });
    });
    test('undo redo', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0, style: { isBold: true } });

      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeNull();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1, row: 0, col: 0, style: { isBold: true } });
    });
  });
});
