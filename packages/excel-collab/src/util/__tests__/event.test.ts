import { vi } from 'vitest';
import { getHitInfo } from '../event';
import type { IController } from '../../types';

function controller(widths = [10, 10], heights = [10, 10]) {
  return {
    getCurrentSheetId: () => 'one',
    getSheetInfo: () => ({ rowCount: heights.length, colCount: widths.length }),
    getScroll: () => ({ row: 0, col: 0 }),
    getHeaderSize: () => ({ width: 5, height: 5 }),
    getColWidth: vi.fn((col: number) => {
      if (col >= widths.length) throw new Error('column outside sheet');
      return widths[col];
    }),
    getRowHeight: vi.fn((row: number) => {
      if (row >= heights.length) throw new Error('row outside sheet');
      return heights[row];
    }),
  } as unknown as IController;
}

describe('getHitInfo', () => {
  test('returns the cell and relative margins inside the sheet', () => {
    expect(getHitInfo(controller(), 17, 18)).toEqual({ row: 1, col: 1, marginX: 2, marginY: 3 });
  });
  test('does not read dimensions beyond the sheet at the lower/right edges', () => {
    expect(getHitInfo(controller(), 25, 10)).toBeUndefined();
    expect(getHitInfo(controller(), 10, 25)).toBeUndefined();
    expect(getHitInfo(controller(), 1000, 1000)).toBeUndefined();
  });
  test('terminates when the remaining rows or columns are all hidden', () => {
    expect(getHitInfo(controller([0, 0]), 10, 10)).toBeUndefined();
    expect(getHitInfo(controller([10], [0, 0]), 10, 10)).toBeUndefined();
    expect(getHitInfo(controller([], []), 10, 10)).toBeUndefined();
  });
});
