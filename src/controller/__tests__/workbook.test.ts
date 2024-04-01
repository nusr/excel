import { Controller } from '..';
import { Model } from '@/model';
import { HTML_FORMAT, PLAIN_FORMAT } from '@/util';

describe('workbook.test.ts', () => {
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

  describe('sheet', () => {
    test('addSheet', () => {
      expect(controller.getScroll()).toEqual({
        top: 0,
        left: 0,
        row: 0,
        col: 0,
        scrollLeft: 0,
        scrollTop: 0,
      });
      expect(controller.getSheetList()).toHaveLength(1);
      controller.addSheet();
      expect(controller.getSheetList()).toHaveLength(2);
    });

    test('deleteSheet', () => {
      const sheetId = controller.getCurrentSheetId();
      controller.addSheet();
      expect(controller.getSheetList()).toHaveLength(2);
      controller.deleteSheet(controller.getCurrentSheetId());
      expect(controller.getSheetList()).toHaveLength(1);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
    });

    test('hideSheet', () => {
      const sheetId = controller.getCurrentSheetId();
      controller.addSheet();
      controller.hideSheet(controller.getCurrentSheetId());
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
      expect(controller.getSheetList()).toHaveLength(2);
    });

    test('unhideSheet', () => {
      controller.addSheet();
      const sheetId = controller.getCurrentSheetId();
      controller.hideSheet(sheetId);
      controller.unhideSheet(sheetId);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
      expect(controller.getSheetList()).toHaveLength(2);
    });

    test('undo redo', () => {
      const firstSheetId = controller.getCurrentSheetId();
      controller.addSheet();
      const sheetId = controller.getCurrentSheetId();
      expect(controller.getSheetList()).toHaveLength(2);
      controller.undo();
      expect(firstSheetId).toEqual(controller.getCurrentSheetId());
      expect(controller.getSheetList()).toHaveLength(1);
      controller.redo();
      expect(controller.getSheetList()).toHaveLength(2);
      expect(sheetId).toEqual(controller.getCurrentSheetId());
    });
  });

  describe('sheetId', () => {
    test('get', () => {
      expect(!!controller.getCurrentSheetId()).toBeTruthy();
    });
    test('set', () => {
      const old = controller.getCurrentSheetId();
      controller.setCurrentSheetId('333');
      expect(controller.getCurrentSheetId()).toEqual(old);
      controller.setCurrentSheetId(old);
      expect(controller.getCurrentSheetId()).toEqual(old);

      controller.addSheet();
      expect(controller.getCurrentSheetId()).not.toEqual(old);
    });
  });
});
