import { IController } from '@/types';
import { initController, getMockHooks } from '..';

describe('definedName.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });

  describe('setDefineName', () => {
    test('empty', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        '',
      );
      expect(controller.getDefineNameList()).toHaveLength(0);
    });
    test('set repeat', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );

      expect(controller.getDefineNameList()).toHaveLength(1);
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );
      expect(
        controller.getDefineName({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual('foo');
    });
    test('ok', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );
      expect(
        controller.getDefineName({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual('foo');
      expect(controller.getDefineNameList()).toHaveLength(1);
      expect(controller.checkDefineName('foo')).toEqual({
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
    });
    test('change', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );
      expect(
        controller.getDefineName({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual('foo');
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'doo',
      );
      expect(
        controller.getDefineName({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual('doo');
    });
  });
  describe('define name', () => {
    test('get', () => {
      const list = controller.getDefineNameList();
      expect(list).toHaveLength(0);
    });

    test('undo redo', () => {
      controller.setDefineName(
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
        'foo',
      );

      controller.undo();
      expect(controller.getDefineNameList()).toHaveLength(0);
      controller.redo();
      expect(controller.getDefineNameList()).toHaveLength(1);
    });
  });
});
