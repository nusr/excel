import { Controller } from '..';
import { Model } from '@/model';
import { getHitInfo } from '@/util';
import { mockHooks } from '../init'

describe('getHitInfo.test.ts', () => {
  test('basic', () => {
    const controller = new Controller(new Model(), mockHooks);
    controller.addSheet();
    const range = getHitInfo(controller, 120, 48);
    expect(range!.row).toEqual(1);
    expect(range!.col).toEqual(1);
  });
  test('not found sheetId', () => {
    const controller = new Controller(new Model(), mockHooks);
    const range = getHitInfo(controller, 10, 10);
    expect(range).toBeUndefined();
  });
  test('x is negative', () => {
    const controller = new Controller(new Model(), mockHooks);
    controller.addSheet();
    const range = getHitInfo(controller, -1, -1);
    expect(range).toBeUndefined();
  });
  test('over threshold', () => {
    const controller = new Controller(new Model(), mockHooks);
    controller.addSheet();
    const range = getHitInfo(controller, 100 * 60, 100 * 60);
    expect(range).toBeUndefined();
  });
});
