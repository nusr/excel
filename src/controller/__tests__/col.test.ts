import { IController } from '../../types';
import { initController } from '..';

describe('col.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController();
    controller.addSheet();
  });
  describe('getColWidth', () => {
    test('not changed', () => {
      controller.setColWidth(0, 100);
      expect(controller.getCol(0).len).toEqual(100);
      controller.setColWidth(0, 100);
      expect(controller.getCol(0).len).toEqual(100);
    });
    test('ok', () => {
      controller.setColWidth(0, 100);
      expect(controller.getCol(0).len).toEqual(100);
    });
  });
  describe('hideCol', () => {
    test('ok', () => {
      controller.hideCol(20, 1);
      expect(controller.getCol(20).isHide).toEqual(true);
    });
    test('no changed', () => {
      controller.hideCol(20, 1);
      expect(controller.getCol(20).isHide).toEqual(true);
      controller.hideCol(20, 1);
      expect(controller.getCol(20).isHide).toEqual(true);
    });
  });
  describe('col', () => {
    test('add', () => {
      const old = controller.getSheetInfo(
        controller.getCurrentSheetId(),
      )!.colCount;
      controller.addCol(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old + 10);

      controller.addCol(20, 0);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old + 10);
    });
    test('delete', () => {
      const old = controller.getSheetInfo(controller.getCurrentSheetId())!;
      controller.deleteCol(20, 10);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old.colCount - 10);

      controller.deleteCol(20, -1);
      expect(
        controller.getSheetInfo(controller.getCurrentSheetId())!.colCount,
      ).toEqual(old.colCount - 10);
    });

    test('undo redo', () => {
      const old = controller.getCol(20).len;
      controller.hideCol(20, 1);
      expect(controller.getCol(20).isHide).toEqual(true);
      controller.undo();
      expect(controller.getCol(20).len).toEqual(old);
      controller.redo();
      expect(controller.getCol(20).isHide).toEqual(true);
    });
  });
  describe('ColWidth', () => {
    test('get', () => {
      expect(controller.getCol(100).len).toEqual(76);
    });
    test('hide', () => {
      controller.hideCol(0, 2);
      expect(controller.getCol(0).isHide).toEqual(true);
      expect(controller.getCol(1).isHide).toEqual(true);
    });

    test('undo redo', () => {
      const old = controller.getCol(0).len;
      controller.setColWidth(0, 300);
      expect(controller.getCol(0).len).toEqual(300);

      controller.undo();
      expect(controller.getCol(0).len).toEqual(old);
      controller.redo();
      expect(controller.getCol(0).len).toEqual(300);

      controller.hideCol(0, 1);
      expect(controller.getCol(0).isHide).toEqual(true);
      controller.undo();
      expect(controller.getCol(0).len).toEqual(300);
    });
  });
  describe('col worksheet drawing', () => {
    test('addCol left setCell', () => {
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
      controller.addCol(1, 1);
      expect(
        controller.getCell({
          row: 0,
          col: 1,
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
          row: 0,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(2);
      expect(
        controller.getCell({
          row: 3,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(11);
      expect(
        controller.getCell({
          row: 0,
          col: 3,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(3);
      expect(
        controller.getCell({
          row: 3,
          col: 3,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(12);
    });
    test('addCol left addDrawing', () => {
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
          row: 0,
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
      controller.addCol(1, 2);
      const data = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      expect(data.fromCol).toEqual(oldData.fromCol + 2);
      expect(data.chartRange!.col).toEqual(oldData.chartRange!.col + 2);
      expect(data.chartRange!.colCount).toEqual(oldData.chartRange!.colCount);
    });
    test('addCol right setCell', () => {
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
      controller.addCol(1, 1, true);
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
          row: 0,
          col: 3,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(3);
      expect(
        controller.getCell({
          row: 0,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toBeUndefined();
      expect(
        controller.getCell({
          row: 3,
          col: 3,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(12);
    });
    test('addCol right addDrawing', () => {
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
          row: 0,
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
      controller.addCol(1, 2, true);
      const data = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      expect(data.fromCol).toEqual(oldData.fromCol + 2);
      expect(data.chartRange!.col).toEqual(oldData.chartRange!.col + 2);
      expect(data.chartRange!.colCount).toEqual(oldData.chartRange!.colCount);
    });
    test('deleteCol setCell', () => {
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
      controller.deleteCol(1, 1);
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
          row: 0,
          col: 1,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(3);
      expect(
        controller.getCell({
          row: 3,
          col: 1,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toEqual(12);
      expect(
        controller.getCell({
          row: 0,
          col: 2,
          rowCount: 1,
          colCount: 1,
          sheetId: '',
        })?.value,
      ).toBeUndefined();
    });
    test('deleteCol addDrawing', () => {
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
          row: 0,
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
      controller.deleteCol(1, 3);
      const data = controller.getDrawingList().find((v) => v.uuid === uuid)!;
      expect(data.fromCol).toEqual(oldData.fromCol - 3);
      expect(data.chartRange!.col).toEqual(0);
      expect(data.chartRange!.colCount).toEqual(3);
    });
    // addCol worksheet drawing
    // deleteCol worksheet drawing
  });
});
