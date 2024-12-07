import { IController } from '../../types';
import { initController, getMockHooks } from '..';

describe('row.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  describe('setRowHeight', () => {
    test('ok', () => {
      controller.setRowHeight(0, 100);
      expect(controller.getRow(0).len).toEqual(100);
    });
    test('no changed', () => {
      controller.setRowHeight(0, 100);
      expect(controller.getRow(0).len).toEqual(100);
      controller.setRowHeight(0, 100);
      expect(controller.getRow(0).len).toEqual(100);
    });
  });
  describe('hideRow', () => {
    test('ok', () => {
      controller.hideRow(20, 1);
      expect(controller.getRow(20).isHide).toEqual(true);
    });
    test('not changed', () => {
      controller.hideRow(20, 1);
      expect(controller.getRow(20).isHide).toEqual(true);
      controller.hideRow(20, 1);
      expect(controller.getRow(20).isHide).toEqual(true);
    });
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

    test('undo redo', () => {
      const old = controller.getRow(20).len;
      controller.hideRow(20, 1);
      expect(controller.getRow(20).isHide).toEqual(true);
      controller.undo();
      expect(controller.getRow(20).len).toEqual(old);
      controller.redo();
      expect(controller.getRow(20).isHide).toEqual(true);
    });
  });
  describe('RowHeight', () => {
    test('get', () => {
      expect(controller.getRow(100).len).toEqual(22);
    });

    test('hide', () => {
      controller.hideRow(0, 2);
      expect(controller.getRow(0).isHide).toEqual(true);
      expect(controller.getRow(1).isHide).toEqual(true);
    });
    test('undo redo', () => {
      const old = controller.getRow(0).len;
      controller.setRowHeight(0, 300);
      expect(controller.getRow(0).len).toEqual(300);

      controller.undo();
      expect(controller.getRow(0).len).toEqual(old);

      controller.redo();
      expect(controller.getRow(0).len).toEqual(300);
    });
  });
  describe('row worksheet drawing', () => {
    test('addRow above setCell', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      expect(
        controller.getCell({
          row: 1,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(4);
      controller.addRow(1, 1, true);
      expect(
        controller.getCell({
          row: 1,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toBeUndefined();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(1);

      expect(
        controller.getCell({
          row: 2,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(4);
      expect(
        controller.getCell({
          row: 3,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(7);
      expect(
        controller.getCell({
          row: 4,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(10);
      expect(
        controller.getCell({
          row: 4,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(12);
    });
    test('addRow above addDrawing', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      const uuid = 'test';
      controller.addDrawing({
        width: 400,
        height: 300,
        originHeight: 300,
        originWidth: 400,
        title: 'chart',
        type: 'chart',
        uuid,
        sheetId: controller.getCurrentSheetId(),
        fromRow: 10,
        fromCol: 10,
        chartRange: {
          row: 2,
          col: 2,
          rowCount: 4,
          colCount: 4,
          sheetId: controller.getCurrentSheetId(),
        },
        chartType: 'line',
        marginX: 0,
        marginY: 0,
      });
      const t = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      const oldData = { ...t, chartRange: { ...t.chartRange! } };
      controller.addRow(1, 2, true);
      const data = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      expect(data.fromRow).toEqual(oldData.fromRow + 2);
      expect(data.chartRange!.row).toEqual(oldData.chartRange!.row + 2);
      expect(data.chartRange!.rowCount).toEqual(oldData.chartRange!.rowCount);
    });
    test('addRow below setCell', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      expect(
        controller.getCell({
          row: 0,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(3);
      controller.addRow(1, 1);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(1);

      expect(
        controller.getCell({
          row: 3,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(7);
      expect(
        controller.getCell({
          row: 2,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toBeUndefined();
      expect(
        controller.getCell({
          row: 4,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(12);
    });
    test('addRow below addDrawing', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      const uuid = 'test';
      controller.addDrawing({
        width: 400,
        height: 300,
        originHeight: 300,
        originWidth: 400,
        title: 'chart',
        type: 'chart',
        uuid,
        sheetId: controller.getCurrentSheetId(),
        fromRow: 10,
        fromCol: 10,
        chartRange: {
          row: 2,
          col: 2,
          rowCount: 4,
          colCount: 4,
          sheetId: controller.getCurrentSheetId(),
        },
        chartType: 'line',
        marginX: 0,
        marginY: 0,
      });
      const t = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      const oldData = { ...t, chartRange: { ...t.chartRange! } };
      controller.addRow(1, 2);
      const data = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      expect(data.fromRow).toEqual(oldData.fromRow + 2);
      expect(data.chartRange!.row).toEqual(oldData.chartRange!.row + 2);
      expect(data.chartRange!.rowCount).toEqual(oldData.chartRange!.rowCount);
    });
    test('deleteRow setCell', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      expect(
        controller.getCell({
          row: 0,
          col: 1,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(2);
      controller.deleteRow(1, 1);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(1);

      expect(
        controller.getCell({
          row: 1,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(7);
      expect(
        controller.getCell({
          row: 2,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(10);
      expect(
        controller.getCell({
          row: 3,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toBeUndefined();
    });
    test('deleteRow addDrawing', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
          [7, 8, 9],
          [10, 11, 12],
        ],
        [],
        {
          row: 0,
          col: 0,
          rowCount: 1,
          colCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      const uuid = 'test';
      controller.addDrawing({
        width: 400,
        height: 300,
        originHeight: 300,
        originWidth: 400,
        title: 'chart',
        type: 'chart',
        uuid,
        sheetId: controller.getCurrentSheetId(),
        fromRow: 10,
        fromCol: 10,
        chartRange: {
          row: 2,
          col: 2,
          rowCount: 4,
          colCount: 4,
          sheetId: controller.getCurrentSheetId(),
        },
        chartType: 'line',
        marginX: 0,
        marginY: 0,
      });
      const t = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      const oldData = { ...t, chartRange: { ...t.chartRange! } };
      controller.deleteRow(1, 3);
      const data = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      expect(data.fromRow).toEqual(oldData.fromRow - 3);
      expect(data.chartRange!.row).toEqual(0);
      expect(data.chartRange!.rowCount).toEqual(3);
    });
  });
});
