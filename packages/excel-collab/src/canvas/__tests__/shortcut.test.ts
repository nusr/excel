import { vi } from 'vitest';
import { handleTabClick, scrollBar, computeScrollRowAndCol } from '../shortcut';
import { IController } from '../../types';

describe('shortcut.test.ts', () => {
  describe('handleTabClick', () => {
    test('should call transaction and setNextActiveCell', () => {
      const controller: IController = {
        setNextActiveCell: vi.fn(),
        transaction: vi.fn(),
      } as unknown as IController;
      handleTabClick(controller);

      expect(controller.transaction).toHaveBeenCalledTimes(1);
    });
    test.each([0, 200])(
      'scrolling a sheet smaller than its viewport stays finite (size %i)',
      (size) => {
        const controller = {
          getScroll: () => ({ left: 0, top: 0, row: 0, col: 0 }),
          getSheetViewSize: () => ({ width: size, height: size }),
          getCanvasSize: () => ({ width: 400, height: 400 }),
          getCurrentSheetId: () => 'sheet',
          getSheetInfo: () => ({ rowCount: 1, colCount: 1 }),
          setScroll: vi.fn(),
        } as unknown as IController;
        scrollBar(controller, 50, 50);
        expect(controller.setScroll).toHaveBeenCalledWith({
          left: 0,
          top: 0,
          scrollLeft: 0,
          scrollTop: 0,
          row: 0,
          col: 0,
        });
      },
    );
    test('scroll coordinates stay within the sheet when trailing rows and columns are hidden', () => {
      const controller = {
        getScroll: () => ({ left: 0, top: 0, row: 0, col: 0 }),
        getCurrentSheetId: () => 'sheet',
        getSheetInfo: () => ({ rowCount: 2, colCount: 3 }),
        getRowHeight: vi.fn(() => 0),
        getColWidth: vi.fn(() => 0),
      } as unknown as IController;
      expect(computeScrollRowAndCol(controller, 200, 200)).toEqual({
        row: 1,
        col: 2,
      });
      expect(controller.getRowHeight).toHaveBeenCalledTimes(1);
      expect(controller.getColWidth).toHaveBeenCalledTimes(2);
    });
  });
});
