import { initController } from '..';
import { getHitInfo } from '../../util';

describe('getHitInfo.test.ts', () => {
  test('basic', () => {
    const controller = initController();
    controller.addSheet();
    const range = getHitInfo(controller, 120, 48);
    expect(range!.row).toEqual(1);
    expect(range!.col).toEqual(1);
  });
  test('not found sheetId', () => {
    const controller = initController();
    const range = getHitInfo(controller, 10, 10);
    expect(range).toBeUndefined();
  });
  test('x is negative', () => {
    const controller = initController();
    controller.addSheet();
    const range = getHitInfo(controller, -1, -1);
    expect(range).toBeUndefined();
  });
  test('over threshold', () => {
    const controller = initController();
    controller.addSheet();
    const range = getHitInfo(controller, 100 * 60, 100 * 60);
    expect(range).toBeUndefined();
  });
});
