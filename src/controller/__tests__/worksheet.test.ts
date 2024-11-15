import { DEFAULT_TEXT_FORMAT_CODE } from '@/util';
import { ModelCellType, WorksheetData } from '@/types';
import { IController } from '@/types';
import { initController, getMockHooks } from '..';

describe('worksheet.test.ts', () => {
  let controller: IController;
  beforeEach(() => {
    controller = initController(getMockHooks());
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
      ).toBeUndefined();
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
      ).toEqual({ value: 1 });
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
      ).toEqual({ formula: '=SUM(1,2)', value: 3 });
    });
    test('set text formula', () => {
      controller.setCell(
        [['=SUM(1,2)']],
        [[{ numberFormat: DEFAULT_TEXT_FORMAT_CODE }]],
        {
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        })?.numberFormat,
      ).toEqual(DEFAULT_TEXT_FORMAT_CODE);
    });
    test('set date', () => {
      controller.setCell([[1]], [[{ numberFormat: 'h:mm:ss AM/PM' }]], {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.setCellValue(new Date('2023-12-11 10:10:10').toString(), {
        row: 0,
        col: 0,
        rowCount: 1,
        colCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      expect(
        Math.floor(
          controller.getCell({
            row: 0,
            col: 0,
            colCount: 1,
            rowCount: 1,
            sheetId: controller.getCurrentSheetId(),
          })!.value as number,
        ),
      ).toEqual(Math.floor(45271));
    });
    test('setFormula setValue', () => {
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
      ).toEqual({ formula: '=SUM(1,2)', value: 3 });

      controller.setCell([['test']], [], {
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
      ).toEqual({ formula: '', value: 'test' });
    });
    test('copy', async () => {
      controller.setCell([['=SUM(1,2)']], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.copy();
      controller.setActiveRange({
        row: 5,
        col: 5,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.paste();
      const result: ModelCellType = {
        formula: '=SUM(1,2)',
        value: 3,
        isBold: true,
      };
      expect(
        controller.getCell({
          row: 5,
          col: 5,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);
    });
    test('cut', async () => {
      controller.setCell([['=SUM(1,2)']], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      controller.setActiveRange({
        row: 0,
        col: 0,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.cut();
      controller.setActiveRange({
        row: 5,
        col: 5,
        colCount: 2,
        rowCount: 2,
        sheetId: controller.getCurrentSheetId(),
      });
      await controller.paste();
      const result: ModelCellType = {
        formula: '=SUM(1,2)',
        value: 3,
        isBold: true,
      };
      expect(
        controller.getCell({
          row: 5,
          col: 5,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeUndefined();
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
      ).toEqual({ value: 1 });
      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeUndefined();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual({ value: 1 });
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
      ).toBeUndefined();
    });
    test('set', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      const result: ModelCellType = { value: 1, isBold: true };
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);
    });
    test('update', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      const result: ModelCellType = { value: 1, isBold: true };
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);
      controller.updateCellStyle(
        { isBold: false, isItalic: true },
        {
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        },
      );
      const result1: ModelCellType = {
        value: 1,
        isBold: false,
        isItalic: true,
      };
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result1);
    });
    test('undo redo', () => {
      controller.setCell([[1]], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });
      const result: ModelCellType = { value: 1, isBold: true };
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);

      controller.undo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toBeUndefined();
      controller.redo();
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);
    });
  });
  describe('worksheet', () => {
    test('get', () => {
      controller.setCell([['1']], [[{ isBold: true }]], {
        row: 0,
        col: 0,
        colCount: 1,
        rowCount: 1,
        sheetId: controller.getCurrentSheetId(),
      });

      const result: ModelCellType = {
        value: 1,
        isBold: true,
      };
      expect(
        controller.getCell({
          row: 0,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        }),
      ).toEqual(result);
    });
    test('set', () => {
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
        })?.value,
      ).toEqual(1);

      controller.setWorksheet([
        { value: 'test', isBold: true, row: 0, col: 0, sheetId: '' },
      ]);
      const result: WorksheetData = [
        {
          value: 'test',
          isBold: true,
          sheetId: controller.getCurrentSheetId(),
          row: 0,
          col: 0,
        },
      ];
      expect(controller.getWorksheet()).toEqual(result);
    });
  });
  describe('cycle import', () => {
    test('ok', () => {
      controller.setCell([['=A2'], ['=A1']], [], {
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
        })?.value,
      ).toBe(0);
      expect(
        controller.getCell({
          row: 1,
          col: 0,
          colCount: 1,
          rowCount: 1,
          sheetId: controller.getCurrentSheetId(),
        })?.value,
      ).toBe(0);
    });
  });
});
