import { Controller } from '..';
import { Model } from '@/model';
import { mockHooks } from '../init'

describe('workbook.test.ts', () => {
  let controller: Controller;
  beforeEach(() => {
    controller = new Controller(new Model(), mockHooks);
    controller.addSheet();
  });
  describe('rename', () => {
    test('ok', () => {
      controller.renameSheet('test');
      expect(controller.getSheetInfo()?.name).toEqual('test');
    });
    test('not changed', () => {
      controller.renameSheet('Sheet1');
      expect(controller.getSheetInfo()?.name).toEqual('Sheet1');
    });
    test('empty', () => {
      const oldName = controller.getSheetInfo()?.name;
      controller.renameSheet('');
      expect(controller.getSheetInfo()?.name).toEqual(oldName);
    });
    test('exist', () => {
      controller.addSheet();
      controller.renameSheet('Sheet1');
      expect(controller.getSheetInfo()?.name).not.toEqual('Sheet1');
    });
  });
  describe('delete sheet', () => {
    test('ok', () => {
      const sheetId = controller.getCurrentSheetId();
      controller.addSheet();
      expect(controller.getSheetList()).toHaveLength(2);
      controller.deleteSheet(controller.getCurrentSheetId());
      expect(controller.getSheetList()).toHaveLength(1);
      expect(controller.getCurrentSheetId()).toEqual(sheetId);
    });
    test('no exist', () => {
      controller.addSheet();
      const len = controller.getSheetList().length;
      controller.deleteSheet('test43434');
      expect(controller.getSheetList()).toHaveLength(len);
    });
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
    test('update', () => {
      const sheetInfo = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!;

      controller.updateSheetInfo(
        { colCount: 10, isHide: true },
        controller.getCurrentSheetId(),
      );
      const newSheetInfo = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!;
      expect(newSheetInfo.colCount).not.toEqual(sheetInfo.colCount);
      expect(newSheetInfo.isHide).not.toEqual(sheetInfo.isHide);
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
