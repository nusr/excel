import { MainCanvas } from '../MainCanvas';
import { initController } from '@/controller';
import { workerSet } from '@/util';
import { RequestMessageType } from '@/types';

const workerData = {
  postMessage: jest.fn(),
  addEventListener: jest.fn(),
} as any as Worker;

const resultData: RequestMessageType = {
  status: 'render',
  changeSet: new Set(['cellStyle']),
  theme: 'light',
  canvasSize: { top: 0, left: 0, width: 0, height: 0 },
  headerSize: { height: 22, width: 38 },
  currentSheetInfo: {
    colCount: 30,
    rowCount: 200,
    isHide: false,
    name: 'Sheet1',
    sort: 1,
    sheetId: '1',
  },
  scroll: {
    col: 0,
    left: 0,
    row: 0,
    scrollLeft: 0,
    scrollTop: 0,
    top: 0,
  },
  range: { col: 0, row: 0, colCount: 1, rowCount: 1, sheetId: '1' },
  copyRange: undefined,
  currentMergeCells: [],
  customHeight: {},
  customWidth: {},
  sheetData: {},
};

describe('MainCanvas.test.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    const spy = jest.spyOn(workerSet, 'get');
    spy.mockReturnValue({ worker: workerData });
  });
  describe('render', () => {
    test('init', () => {
      const offscreen = {} as OffscreenCanvas;
      new MainCanvas(initController(), {
        transferControlToOffscreen() {
          return offscreen;
        },
      } as HTMLCanvasElement);
      const data: RequestMessageType = {
        status: 'init',
        canvas: offscreen,
        dpr: 1,
      };
      expect(workerData.postMessage).toHaveBeenCalledWith(data, [offscreen]);
    });
    test('render ok', () => {
      const instance = new MainCanvas(
        initController(),
        {} as HTMLCanvasElement,
      );
      instance.render({ changeSet: new Set(['cellStyle']) });
      const result: RequestMessageType = {
        ...resultData,
        changeSet: new Set(['cellStyle']),
      };
      expect(workerData.postMessage).toHaveBeenCalledWith(result);
    });
  });
  describe('resize', () => {
    test('resize ok', () => {
      const instance = new MainCanvas(initController(), {
        style: { width: '', height: '' },
      } as HTMLCanvasElement);
      instance.resize();
      const eventData: RequestMessageType = {
        status: 'resize',
        width: 0,
        height: 0,
      };
      expect(workerData.postMessage).toHaveBeenCalledWith(eventData);
    });
  });
});
