import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('row.test.ts', () => {
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
  describe('row', () => {
    test('add', () => {
      const old = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!.rowCount;
      controller.addRow(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old + 10);

      controller.addRow(20, 0);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old + 10);
    });
    test('delete', () => {
      const old = controller.getSheetInfo(controller.getCurrentSheetId())!;
      controller.deleteRow(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old.rowCount - 10);

      controller.deleteRow(20, -1);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.rowCount,
      ).toEqual(old.rowCount - 10);
    });
    test('hide', () => {
      controller.hideRow(20, 1);
      expect(controller.getRowHeight(20).len).toEqual(0);
    });
    test('undo redo', () => {
      const old = controller.getRowHeight(20).len;
      controller.hideRow(20, 1);
      expect(controller.getRowHeight(20).len).toEqual(0);
      controller.undo();
      expect(controller.getRowHeight(20).len).toEqual(old);
      controller.redo();
      expect(controller.getRowHeight(20).len).toEqual(0);
    });
  });
  describe('RowHeight', () => {
    test('get', () => {
      expect(controller.getRowHeight(100).len).toEqual(24);
    });
    test('set', () => {
      controller.setRowHeight(0, 100);
      expect(controller.getRowHeight(0).len).toEqual(100);
    });
    test('hide', () => {
      controller.hideRow(0, 2);
      expect(controller.getRowHeight(0).len).toEqual(0);
      expect(controller.getRowHeight(1).len).toEqual(0);
    });
    test('undo redo', () => {
      const old = controller.getRowHeight(0).len;
      controller.setRowHeight(0, 300);
      expect(controller.getRowHeight(0).len).toEqual(300);

      controller.undo();
      expect(controller.getRowHeight(0).len).toEqual(old);

      controller.redo();
      expect(controller.getRowHeight(0).len).toEqual(300);
    });
  });
});
