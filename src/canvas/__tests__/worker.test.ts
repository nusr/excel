import workerMethod from '../worker';
import { npx } from '@/util/dpr';
import { RequestInit, RequestFormulas } from '@/types';
import OffScreenWorker from '../offScreenWorker';
import { initController, getMockHooks } from '@/controller';
import { getRenderData } from './util';
jest.mock('../offScreenWorker');

describe('workerMethod', () => {
  const initData: RequestInit = {
    canvas: {} as unknown as OffscreenCanvas,
    dpr: 2,
  };
  beforeEach(() => {
    // @ts-ignore
    OffScreenWorker.mockClear();
  });
  test('should initialize OffScreenWorker', () => {
    workerMethod.init(initData);
    expect(npx(1)).toEqual(2);
    expect(OffScreenWorker).toHaveBeenCalledTimes(1);
  });

  test('should call resize on OffScreenWorker instance', () => {
    workerMethod.init(initData);
    workerMethod.resize({ width: 100, height: 100 });
    // @ts-ignore
    const mockInstance = OffScreenWorker.mock.instances[0];
    expect(mockInstance.resize).toHaveBeenCalledWith({
      width: 100,
      height: 100,
    });
  });
  test('should call render on OffScreenWorker instance', async () => {
    workerMethod.init(initData);
    const c = initController(getMockHooks());
    c.addSheet();
    const data = await getRenderData(c, 'light');
    const callback = jest.fn();
    // @ts-ignore
    const mockInstance = OffScreenWorker.mock.instances[0];
    mockInstance.render.mockReturnValue(undefined);
    workerMethod.render(data, callback);

    expect(mockInstance.render).toHaveBeenCalledWith(data);
    expect(callback).toHaveBeenCalledTimes(0);
  });

  test('should call render on OffScreenWorker instance and callback', async () => {
    workerMethod.init(initData);
    const c = initController(getMockHooks())
    c.addSheet();
    const data = await getRenderData(c, 'light');
    const callback = jest.fn();
    callback.mockReturnValue({ rowMap: { 1: 100 } });
    // @ts-ignore
    const mockInstance = OffScreenWorker.mock.instances[0];
    mockInstance.render.mockReturnValue({ rowMap: { 1: 100 } });

    workerMethod.render(data, callback);

    expect(mockInstance.render).toHaveBeenCalledWith(data);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test('should call computeFormulas on OffScreenWorker instance', async () => {
    const c = initController(getMockHooks())
    c.addSheet();
    const sheetId = c.getCurrentSheetId();
    const data: RequestFormulas = {
      worksheets: {
        [`${sheetId}_0_0`]: {
          formula: '=SUM(1,2)',
          value: '',
        },
      },
      definedNames: {},
      currentSheetId: sheetId,
      workbook: c.getSheetList(),
    };
    const callback = jest.fn();
    workerMethod.computeFormulas(data, callback);

    expect(callback).toHaveBeenCalledWith({
      list: [
        {
          key: `${sheetId}_0_0`,
          sheetId,
          newValue: 3,
        },
      ],
    });
  });
});
