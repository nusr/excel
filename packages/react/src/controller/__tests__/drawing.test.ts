import { IController } from '@excel/shared';
import { initController, getMockHooks } from '..';

describe('drawing.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
    controller.addSheet();
  });
  describe('addDrawing', () => {
    test('empty chartType', () => {
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      }),
        expect(controller.getDrawingList()).toHaveLength(0);
    });
    test('not support chartType', () => {
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'test' as any,
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      }),
        expect(controller.getDrawingList()).toHaveLength(0);
    });
    test('not support chartRange', () => {
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'line',
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()).toHaveLength(0);
    });
    test('chartRange not data', () => {
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'line',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()).toHaveLength(0);
    });
    test('ok', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList('')).toHaveLength(1);

      controller.deleteDrawing('1');
      expect(controller.getDrawingList('')).toHaveLength(0);
    });
  });
  describe('updateDrawing', () => {
    test('empty value', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()[0].chartType).toEqual('bar');
      controller.updateDrawing('1', {});
      expect(controller.getDrawingList()[0].chartType).toEqual('bar');
    });
    test('not found uuids', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()[0].chartType).toEqual('bar');
      controller.updateDrawing('aaa', { chartType: 'line' });
      expect(controller.getDrawingList()[0].chartType).toEqual('bar');
    });
    test('ok', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()[0].chartType).toEqual('bar');
      controller.updateDrawing('1', { chartType: 'line' });
      expect(controller.getDrawingList()[0].chartType).toEqual('line');
    });
  });
  describe('deleteDrawing', () => {
    test('not found uuid', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()).toHaveLength(1);
      controller.deleteDrawing('aaaa');
      expect(controller.getDrawingList()).toHaveLength(1);
    });
    test('ok', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList()).toHaveLength(1);
      controller.deleteDrawing('1');
      expect(controller.getDrawingList()).toHaveLength(0);
    });
  });
  describe('float element', () => {
    test('copy', async () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(
        controller.getDrawingList(controller.getCurrentSheetId()),
      ).toHaveLength(1);
      controller.setFloatElementUuid('1');
      await controller.copy();
      await controller.paste();
      expect(
        controller.getDrawingList(controller.getCurrentSheetId()),
      ).toHaveLength(2);
      controller.setFloatElementUuid('');
    });
    test('cut', async () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'bar',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 10,
        marginY: 20,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(
        controller.getDrawingList(controller.getCurrentSheetId()),
      ).toHaveLength(1);
      controller.setFloatElementUuid('1');
      await controller.cut();
      await controller.paste();
      const item = controller.getDrawingList(controller.getCurrentSheetId())[0];
      expect(item.fromRow).toEqual(0);
      expect(item.fromCol).toEqual(0);
      expect(item.marginX).toEqual(0);
      expect(item.marginY).toEqual(0);
    });
    test('undo redo', () => {
      controller.setCell(
        [
          [1, 2, 3],
          [4, 5, 6],
        ],
        [],
        { row: 0, col: 0, colCount: 1, rowCount: 1, sheetId: '' },
      );
      controller.addDrawing({
        title: 'chart',
        type: 'chart',
        chartType: 'line',
        chartRange: { row: 0, col: 0, rowCount: 4, colCount: 4, sheetId: '' },
        sheetId: controller.getCurrentSheetId(),
        width: 300,
        height: 300,
        marginX: 0,
        marginY: 0,
        originHeight: 300,
        originWidth: 300,
        uuid: '1',
        fromCol: 4,
        fromRow: 4,
      });
      expect(controller.getDrawingList('')).toHaveLength(1);
      controller.undo();
      expect(controller.getDrawingList('')).toHaveLength(0);
      controller.redo();
      expect(controller.getDrawingList('')).toHaveLength(1);

      controller.updateDrawing('1', {
        width: 100,
        height: 100,
        chartType: 'bar',
      });
      expect(
        controller.getDrawingList('').find((v) => v.uuid === '1')!.width,
      ).toEqual(100);
      expect(
        controller.getDrawingList('').find((v) => v.uuid === '1')!.height,
      ).toEqual(100);
      expect(
        controller.getDrawingList('').find((v) => v.uuid === '1')!.chartType,
      ).toEqual('bar');

      controller.undo();
      expect(
        controller.getDrawingList('').find((v) => v.uuid === '1')!.width,
      ).toEqual(300);
      expect(
        controller.getDrawingList('').find((v) => v.uuid === '1')!.height,
      ).toEqual(300);
      expect(
        controller.getDrawingList('').find((v) => v.uuid === '1')!.chartType,
      ).toEqual('line');
    });
  });
});
