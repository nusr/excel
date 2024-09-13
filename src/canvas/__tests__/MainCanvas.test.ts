import { MainCanvas } from '../MainCanvas';
import { initController } from '@/controller';
import { RequestRender, IWindowSize, IHooks } from '@/types';
import { mockHooks } from '@/controller/init'

const mockWorker: any = {
  init: jest.fn(),
  render: jest.fn(),
  resize: jest.fn(),
  computeFormulas: jest.fn(),
}

const hooks: IHooks = {
  ...mockHooks,
  worker: mockWorker
}


const resultData: RequestRender = {
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
  });
  describe('render', () => {
    test('init', () => {
      const offscreen = {} as OffscreenCanvas;
      new MainCanvas(initController(false, hooks), {
        transferControlToOffscreen() {
          return offscreen;
        },
      } as HTMLCanvasElement);
      expect(mockWorker.init).toHaveBeenCalledWith({ "canvas": {}, "dpr": 1 });
    });
    test('render ok', () => {
      const instance = new MainCanvas(
        initController(false, hooks),
        {} as HTMLCanvasElement,
      );
      instance.render({ changeSet: new Set(['cellStyle']) });
      const result: RequestRender = {
        ...resultData,
        changeSet: new Set(['cellStyle']),
      };
      expect(mockWorker.render).toHaveBeenCalledWith(result, expect.any(Function));
    });
  });
  describe('resize', () => {
    test('resize ok', () => {
      const instance = new MainCanvas(initController(false, hooks), {
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
