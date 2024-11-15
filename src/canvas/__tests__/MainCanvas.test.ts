import { MainCanvas } from '../MainCanvas';
import { initController } from '@/controller';
import {
  RequestRender,
  IWindowSize,
  IHooks,
  ResponseRender,
  RemoteWorkerMethod,
} from '@/types';
import { getMockHooks } from '@/controller/init';
import { CELL_HEIGHT, CELL_WIDTH } from '@/util';

const mockWorker = {
  init: jest.fn(),
  render: jest.fn(),
  resize: jest.fn(),
  computeFormulas: jest.fn(),
};

const hooks: IHooks = {
  ...getMockHooks(),
  worker: mockWorker as unknown as RemoteWorkerMethod,
};

const resultData: RequestRender = {
  changeSet: new Set(['cellStyle']),
  theme: 'light',
  canvasSize: { top: 0, left: 0, width: 0, height: 0 },
  headerSize: { height: 22, width: 38 },
  currentSheetInfo: {
    colCount: 30,
    rowCount: 200,
    isHide: false,
    name: 'Sheet2',
    sort: 2,
    sheetId: '2',
  },
  scroll: {
    col: 0,
    left: 0,
    row: 0,
    scrollLeft: 0,
    scrollTop: 0,
    top: 0,
  },
  range: { col: 0, row: 0, colCount: 1, rowCount: 1, sheetId: '2' },
  copyRange: undefined,
  currentMergeCells: [],
  customHeight: {},
  customWidth: {},
  sheetData: {},
  autoFilter: undefined,
};

describe('MainCanvas.test.ts', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
  describe('render', () => {
    test('init', () => {
      const offscreen = {} as OffscreenCanvas;
      const c = initController(hooks);
      c.addSheet()
      new MainCanvas(c, {
        transferControlToOffscreen() {
          return offscreen;
        },
      } as HTMLCanvasElement);
      expect(mockWorker.init).toHaveBeenCalledWith({ canvas: {}, dpr: 1 });
    });
    test('render ok', async () => {
      const c = initController(hooks);
      c.addSheet()
      const instance = new MainCanvas(
        c,
        {} as HTMLCanvasElement,
      );
      await instance.render({ changeSet: new Set(['cellStyle']) });
      const result: RequestRender = {
        ...resultData,
        changeSet: new Set(['cellStyle']),
      };
      expect(mockWorker.render).toHaveBeenCalledWith(
        result,
        expect.any(Function),
      );
    });
    test('render callback ok', async () => {
      // @ts-ignore
      hooks.worker.render = jest
        .fn()
        .mockImplementation(
          (_data: RequestRender, cb: (data: ResponseRender) => void) => {
            cb({ rowMap: { 1: 300 }, colMap: { 1: 600 } });
            return Promise.resolve();
          },
        );
      const c = initController(hooks);
      c.addSheet()
      const instance = new MainCanvas(c, {} as HTMLCanvasElement);
      await instance.render({ changeSet: new Set(['cellStyle']) });
      expect(c.getRow(1).len).toBe(300);
      expect(c.getCol(1).len).toBe(600);
    });
    test('render callback fail', async () => {
      // @ts-ignore
      hooks.worker.render = jest
        .fn()
        .mockImplementation(
          (_data: RequestRender, cb: (data: ResponseRender) => void) => {
            cb({ rowMap: {}, colMap: {} });
            return Promise.resolve();
          },
        );
      const c = initController(hooks);
      c.addSheet()
      const instance = new MainCanvas(c, {} as HTMLCanvasElement);
      await instance.render({ changeSet: new Set(['cellStyle']) });
      expect(c.getRow(1).len).toBe(CELL_HEIGHT);
      expect(c.getCol(1).len).toBe(CELL_WIDTH);
    });
  });
  describe('resize', () => {
    test('resize ok', () => {
      const c = initController(hooks);
      c.addSheet()
      const instance = new MainCanvas(c, {
        style: { width: '', height: '' },
      } as HTMLCanvasElement);
      instance.resize();
      const eventData: IWindowSize = {
        width: 0,
        height: 0,
      };
      expect(mockWorker.resize).toHaveBeenCalledWith(eventData);
    });
  });
});
