import { createCanvas } from 'canvas';
import { vi } from 'vitest';
import OffScreenWorker from '../offScreenWorker';
import type { RequestRender } from '../../types';
import {
  CELL_HEIGHT,
  CELL_WIDTH,
  DEFAULT_LINE_WIDTH,
  FILTER_RECT_SIZE,
  getCustomWidthOrHeightKey,
  npx,
  setDpr,
} from '../../util';
import { getThemeColor } from '../../theme';

describe('OffScreenWorker rendering regressions', () => {
  let worker: OffScreenWorker;
  let ctx: CanvasRenderingContext2D;
  let data: RequestRender;

  beforeEach(() => {
    setDpr(1);
    const canvas = createCanvas(400, 250);
    ctx = canvas.getContext('2d') as unknown as CanvasRenderingContext2D;
    worker = new OffScreenWorker(canvas as unknown as OffscreenCanvas);
    worker.resize({ width: 400, height: 250 });
    data = {
      changeSet: new Set(['cellStyle']),
      theme: 'light',
      canvasSize: { top: 0, left: 0, width: 400, height: 250 },
      headerSize: { width: 38, height: 22 },
      currentSheetInfo: {
        sheetId: 'sheet',
        name: 'Sheet1',
        rowCount: 4,
        colCount: 4,
        isHide: false,
        sort: 0,
      },
      scroll: { row: 0, col: 0, top: 0, left: 0, scrollTop: 0, scrollLeft: 0 },
      range: { sheetId: 'sheet', row: 0, col: 0, rowCount: 1, colCount: 1 },
      copyRange: undefined,
      customHeight: {},
      customWidth: {},
      currentMergeCells: [],
      sheetData: {},
      autoFilter: undefined,
    };
  });

  afterEach(() => {
    vi.restoreAllMocks();
    setDpr(2);
  });

  test('copy outline follows the copied range, not the current selection', () => {
    data.copyRange = { ...data.range, row: 1, col: 1 };
    data.range = { ...data.range, row: 2, col: 2 };
    const stroke = vi.spyOn(ctx, 'strokeRect');
    worker.render(data);
    expect(stroke).toHaveBeenNthCalledWith(
      1,
      npx(38 + CELL_WIDTH + DEFAULT_LINE_WIDTH),
      npx(22 + CELL_HEIGHT + DEFAULT_LINE_WIDTH),
      npx(CELL_WIDTH - DEFAULT_LINE_WIDTH * 2),
      npx(CELL_HEIGHT - DEFAULT_LINE_WIDTH * 2),
    );
  });

  test('a range preceding the viewport uses the dimensions of preceding rows and columns', () => {
    data.scroll = { ...data.scroll, row: 1, col: 1 };
    data.range = { ...data.range, rowCount: 2, colCount: 2 };
    data.customHeight[getCustomWidthOrHeightKey('sheet', 0)] = { len: 30, isHide: false };
    data.customHeight[getCustomWidthOrHeightKey('sheet', 1)] = { len: 50, isHide: false };
    data.customWidth[getCustomWidthOrHeightKey('sheet', 0)] = { len: 40, isHide: false };
    data.customWidth[getCustomWidthOrHeightKey('sheet', 1)] = { len: 90, isHide: false };
    const stroke = vi.spyOn(ctx, 'strokeRect');
    worker.render(data);
    expect(stroke).toHaveBeenLastCalledWith(npx(38 - 40), npx(22 - 30), npx(130), npx(80));
  });

  test('a render failure does not permanently lock later renders', () => {
    vi.spyOn(ctx, 'clearRect').mockImplementationOnce(() => {
      throw new Error('render failed');
    });
    expect(() => worker.render(data)).toThrow('render failed');
    expect(worker.render(data)).toEqual({ rowMap: {}, colMap: {} });
  });

  test('hidden trailing rows and columns do not add a phantom grid cell', () => {
    data.currentSheetInfo.rowCount = 2;
    data.currentSheetInfo.colCount = 2;
    data.customHeight[getCustomWidthOrHeightKey('sheet', 1)] = { len: CELL_HEIGHT, isHide: true };
    data.customWidth[getCustomWidthOrHeightKey('sheet', 1)] = { len: CELL_WIDTH, isHide: true };
    worker.render(data);
    const line = vi.spyOn(ctx, 'lineTo');
    worker['renderGrid'](300, 200);
    expect(line.mock.calls.every(([x, y]) => x <= npx(CELL_WIDTH) && y <= npx(CELL_HEIGHT))).toBe(
      true,
    );
  });

  test('filter icons use their header row and disappear when it scrolls out of view', () => {
    data.autoFilter = {
      range: { ...data.range, row: 2, rowCount: 2 },
      col: 0,
    };
    const stroke = vi.spyOn(ctx, 'strokeRect');
    worker.render(data);
    expect(stroke).toHaveBeenNthCalledWith(
      1,
      npx(38 + CELL_WIDTH - FILTER_RECT_SIZE - DEFAULT_LINE_WIDTH * 4),
      npx(22 + CELL_HEIGHT * 3 - FILTER_RECT_SIZE - DEFAULT_LINE_WIDTH * 4),
      npx(FILTER_RECT_SIZE),
      npx(FILTER_RECT_SIZE),
    );
    stroke.mockClear();
    data.scroll = { ...data.scroll, row: 3 };
    worker.render(data);
    expect(stroke).toHaveBeenCalledTimes(1);
  });

  test('custom cell borders do not change the selection outline color', () => {
    data.sheetData.sheet_0_0 = {
      value: '',
      borderBottom: { type: 'thin', color: '#ff0000' },
    };
    const colors: string[] = [];
    const strokeRect = ctx.strokeRect.bind(ctx);
    vi.spyOn(ctx, 'strokeRect').mockImplementation((...args) => {
      colors.push(ctx.strokeStyle as string);
      strokeRect(...args);
    });
    worker.render(data);
    expect(colors.at(-1)).toBe(getThemeColor('primaryColor', 'light'));
  });
});
